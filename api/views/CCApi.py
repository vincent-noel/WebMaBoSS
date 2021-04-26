from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework import status

# import biolqm
import requests

class CCApi(APIView):

    def __init__(self, *args, **kwargs):
        APIView.__init__(self, *args, **kwargs)
    
    def get(self, request):
        
        count = requests.get('https://research.cellcollective.org/_api/model/cards/count/research?modelTypes=boolean').json()
        all = requests.get("https://research.cellcollective.org/api/model/cards/research?category=published&orderBy=recent&modelTypes=boolean&cards=" + str(count["published"])).json()
        return Response([{'id' : data["model"]["id"], 'name': data["model"]["name"], 'author': data["model"]["author"]} for data in all])
