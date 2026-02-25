import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_llm_response():
    return {
        "choices": [{
            "message": {
                "content": """# React Tutorial

## Components Detected:
- Header Component
- Button Component
- Card Component

## Step 1: Create the Header

First, let's create a simple header component:

\`\`\`tsx
const Header = () => {
  return <header className="p-4">My App</header>
}
\`\`\`

## Step 2: Add useState for state management

\`\`\`tsx
const [count, setCount] = useState(0)
\`\`\`

## Final Code

Complete implementation above.
"""
            }
        }]
    }
