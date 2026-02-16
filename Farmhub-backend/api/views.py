from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'message': 'Welcome to FarmHub API',
        'endpoints': {
            'Register': '/api/auth/register/',
            'Login': '/api/auth/login/',
            'API Docs': 'http://localhost:8000/api/',
        }
    }
    return Response(api_urls)