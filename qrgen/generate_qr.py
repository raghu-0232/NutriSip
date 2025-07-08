import qrcode

def generate_qr_code(data, filename):
    img = qrcode.make(data)
    img.save(filename)
    print(f"QR code for '{data}' saved as '{filename}'")

if __name__ == "__main__":
    # Example usage:
    generate_qr_code("https://nutrisip.srianjaneyaprojects.com/", "nutrisip_qr.png")
    pass
