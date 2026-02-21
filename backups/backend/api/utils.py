import requests
import base64
from datetime import datetime
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

def get_mpesa_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    auth = f"{settings.MPESA_CONSUMER_KEY}:{settings.MPESA_CONSUMER_SECRET}"
    encoded_auth = base64.b64encode(auth.encode()).decode()
    
    headers = {"Authorization": f"Basic {encoded_auth}"}
    try:
        res = requests.get(url, headers=headers, timeout=30)
        if res.status_code == 200:
            return res.json().get("access_token")
        print(f"DEBUG: Safaricom Token Auth Failed (Status {res.status_code}): {res.text}")
        return None
    except requests.exceptions.Timeout:
        print("DEBUG: M-Pesa Auth Timeout - Safaricom sandbox is slow or unreachable.")
        return None
    except Exception as e:
        print(f"DEBUG: M-Pesa Connection Error (Auth): {str(e)}")
        return None

def initiate_stk_push(phone, amount, land_title):
    token = get_mpesa_access_token()
    if not token:
        return {"error": "Failed to authenticate with Safaricom. The Sandbox might be down."}

    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(
        f"{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}".encode()
    ).decode()

    # Format phone to 254...
    if phone.startswith("0"): phone = "254" + phone[1:]
    if phone.startswith("+"): phone = phone[1:]

    # Clean and shorten land_title for Safaricom (Alphanumeric only, max 12-20 chars)
    import re
    clean_title = re.sub(r'[^a-zA-Z0-9]', '', land_title)[:12]

    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(float(amount)),
        "PartyA": phone,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": clean_title,
        "TransactionDesc": f"Pay {clean_title}"
    }

    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = requests.post(url, json=payload, headers=headers, timeout=30)
        return res.json()
    except requests.exceptions.Timeout:
        print("DEBUG: STK Push Timeout - Safaricom sandbox took too long to respond.")
        return {"error": "Safaricom response timed out. Please try again."}
    except Exception as e:
        print(f"DEBUG: STK Push Connection Error: {str(e)}")
        return {"error": "Connection to Safaricom failed."}

def send_winner_email(user_email, user_name, land_title, amount):
    subject = f"Congratulations! You won the auction for {land_title}"
    
    context = {
        'user_name': user_name,
        'land_title': land_title,
        'amount': f"{float(amount):,.2f}",
        'login_url': 'http://localhost:3000/login'
    }
    
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #198754; text-align: center;">FarmHub Kenya</h2>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p>Hi <strong>{user_name}</strong>,</p>
                <p>Congratulations! You have emerged as the winner of the auction for:</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">{land_title}</h3>
                    <p style="font-size: 1.2em; color: #198754; font-weight: bold; margin-bottom: 0;">
                        Winning Bid: KES {float(amount):,.2f}
                    </p>
                </div>
                <p>To secure your lease, please log in to your dashboard and complete the payment via M-Pesa.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:3000/login" style="background-color: #198754; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Pay Now</a>
                </div>
                <p>Thank you for choosing FarmHub!</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p style="font-size: 0.8em; color: #777; text-align: center;">
                    &copy; 2026 FarmHub Kenya. All rights reserved.<br>
                    This is an automated notification. Please do not reply directly to this email.
                </p>
            </div>
        </body>
    </html>
    """
    
    send_mail(
        subject,
        "", # Plain text version empty
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
        html_message=html_message
    )
