from supabase import create_client, Client

#For Testing locally:
#Will be changed to my prod server
URL = "http://localhost:8000"

#Not ready for prod yet. Key is there for ease, will be using a .env file if deployed.
#DB is hosted locally, no external connections atm
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q"

#Using Constant for SUPABASE creds since it will never be changed by the script. Used multiple times
SUPABASE: Client = create_client(URL, KEY)

def save(encoded, decoded):
    #Date is handled by supabase incase the script is ran in a different timezone by accident
    data = {"Encoded": encoded, "Decoded": decoded}
    response = SUPABASE.table("URL_Shortener").insert(data).execute()

    return response

#Returns an encoded string from an entire url
def read_encode(decoded):
    response = SUPABASE.table("URL_Shortener").select("Encoded").eq("Decoded", decoded).execute()
    
    if response.data:
        return response.data[0]["Encoded"]
    else:
        return None

#Returns an decoded url from an entire encoded string
def read_decode(encoded):
    response = SUPABASE.table("URL_Shortener").select("Decoded").eq("Encoded", encoded).execute()

    if response.data:
        return response.data[0]["Decoded"]
    else:
        return None


    
    