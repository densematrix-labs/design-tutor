import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from io import BytesIO

def test_analyze_invalid_file(client):
    """Test that non-image files are rejected"""
    response = client.post(
        "/api/v1/tutor/analyze",
        files={"image": ("test.txt", b"not an image", "text/plain")},
        data={"language": "en"}
    )
    assert response.status_code == 400
    assert "image" in response.json()["detail"].lower()

def test_analyze_missing_file(client):
    """Test that missing file returns error"""
    response = client.post("/api/v1/tutor/analyze")
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_analyze_success(client, mock_llm_response):
    """Test successful tutorial generation"""
    # Create a simple PNG image (1x1 pixel)
    png_data = bytes([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
        0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
        0x54, 0x08, 0xD7, 0x63, 0xF8, 0xFF, 0xFF, 0x3F,
        0x00, 0x05, 0xFE, 0x02, 0xFE, 0xDC, 0xCC, 0x59,
        0xE7, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
        0x44, 0xAE, 0x42, 0x60, 0x82
    ])
    
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = mock_llm_response
    
    with patch("httpx.AsyncClient") as mock_client_class:
        mock_client = AsyncMock()
        mock_client.post.return_value = mock_response
        mock_client.__aenter__.return_value = mock_client
        mock_client.__aexit__.return_value = None
        mock_client_class.return_value = mock_client
        
        response = client.post(
            "/api/v1/tutor/analyze",
            files={"image": ("test.png", png_data, "image/png")},
            data={"language": "en"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "tutorial" in data
        assert "components_detected" in data
        assert "estimated_difficulty" in data
        assert "estimated_time" in data

def test_all_languages_supported(client):
    """Verify all supported languages are recognized"""
    from app.api.v1.tutor import LANGUAGE_INSTRUCTIONS
    
    expected_languages = ["en", "zh", "ja", "de", "fr", "ko", "es"]
    for lang in expected_languages:
        assert lang in LANGUAGE_INSTRUCTIONS

def test_error_response_format(client):
    """Verify error responses have proper format"""
    response = client.post(
        "/api/v1/tutor/analyze",
        files={"image": ("test.txt", b"not an image", "text/plain")}
    )
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert isinstance(data["detail"], str), "Error detail should be a string"
