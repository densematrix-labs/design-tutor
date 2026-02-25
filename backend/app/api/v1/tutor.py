from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import httpx
import base64
import os

router = APIRouter(prefix="/api/v1/tutor", tags=["tutor"])

class TutorialResponse(BaseModel):
    tutorial: str
    components_detected: list[str]
    estimated_difficulty: str
    estimated_time: str

class TutorialRequest(BaseModel):
    language: str = "en"

SYSTEM_PROMPT = """You are an expert React developer and teacher. Analyze the design screenshot and create a step-by-step tutorial for implementing it in React.

Your tutorial should:
1. First identify all UI components visible in the design
2. Break down the implementation into small, manageable steps
3. Provide code snippets for each step with explanations
4. Use modern React (hooks, functional components)
5. Include Tailwind CSS for styling
6. Explain WHY each step is done, not just WHAT

Format your response as markdown with clear sections:
- **Components Detected**: List of UI components you see
- **Step 1**: Setting up the project structure
- **Step 2-N**: Each component/feature implementation
- **Final Code**: Complete component code

Be encouraging and explain things clearly for beginners."""

LANGUAGE_INSTRUCTIONS = {
    "en": "Write the tutorial in English.",
    "zh": "用中文写教程。",
    "ja": "チュートリアルを日本語で書いてください。",
    "de": "Schreiben Sie das Tutorial auf Deutsch.",
    "fr": "Rédigez le tutoriel en français.",
    "ko": "한국어로 튜토리얼을 작성하세요.",
    "es": "Escribe el tutorial en español."
}

@router.post("/analyze", response_model=TutorialResponse)
async def analyze_design(
    image: UploadFile = File(...),
    language: str = "en"
):
    """Analyze a design screenshot and generate a React tutorial"""
    
    # Validate file type
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file")
    
    # Read and encode image
    image_data = await image.read()
    if len(image_data) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Image too large. Max 10MB.")
    
    base64_image = base64.b64encode(image_data).decode("utf-8")
    mime_type = image.content_type or "image/png"
    
    # Get language instruction
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])
    
    # Call LLM Proxy with vision
    llm_url = os.getenv("LLM_PROXY_URL", "https://llm-proxy.densematrix.ai")
    llm_key = os.getenv("LLM_PROXY_KEY", "")
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{llm_url}/v1/chat/completions",
                headers={"Authorization": f"Bearer {llm_key}"},
                json={
                    "model": "claude-sonnet-4-20250514",
                    "max_tokens": 4096,
                    "messages": [
                        {
                            "role": "system",
                            "content": f"{SYSTEM_PROMPT}\n\n{lang_instruction}"
                        },
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:{mime_type};base64,{base64_image}"
                                    }
                                },
                                {
                                    "type": "text",
                                    "text": "Analyze this design and create a detailed React tutorial to implement it."
                                }
                            ]
                        }
                    ]
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=500,
                    detail=f"LLM service error: {response.text}"
                )
            
            result = response.json()
            tutorial_text = result["choices"][0]["message"]["content"]
            
            # Extract components (simple heuristic)
            components = []
            lines = tutorial_text.split("\n")
            for line in lines:
                if "component" in line.lower() and (":" in line or "-" in line):
                    # Extract component names
                    parts = line.replace("*", "").replace("-", "").strip().split(":")
                    if len(parts) > 0:
                        comp_name = parts[0].strip()
                        if len(comp_name) < 50:
                            components.append(comp_name)
            
            # Limit to 10 components
            components = components[:10] if components else ["UI Components detected in tutorial"]
            
            # Estimate difficulty based on content
            difficulty = "Intermediate"
            if "useState" in tutorial_text and "useEffect" not in tutorial_text:
                difficulty = "Beginner"
            elif "useContext" in tutorial_text or "useReducer" in tutorial_text:
                difficulty = "Advanced"
            
            # Estimate time (rough heuristic based on tutorial length)
            word_count = len(tutorial_text.split())
            if word_count < 500:
                time_estimate = "15-30 minutes"
            elif word_count < 1000:
                time_estimate = "30-60 minutes"
            else:
                time_estimate = "1-2 hours"
            
            return TutorialResponse(
                tutorial=tutorial_text,
                components_detected=components,
                estimated_difficulty=difficulty,
                estimated_time=time_estimate
            )
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request timed out. Please try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
