from PIL import Image, ImageOps

input_path = r"C:\Projects\AA\SS_12_26\Logo\Final_Logo.jpg"
output_full_trans = r"C:\Projects\AA\SS_12_26\frontend\src\assets\logo_transparent.png"
output_full_white = r"C:\Projects\AA\SS_12_26\frontend\src\assets\logo_transparent_white_text.png"
output_bookmark = r"C:\Projects\AA\SS_12_26\frontend\public\bookmark_logo.png"

# Load image
img = Image.open(input_path).convert("RGBA")
datas = img.getdata()

# Make white background transparent
new_data = []
for item in datas:
    # change all white (also shades of whites)
    # to transparent
    if item[0] in list(range(210, 256)) and item[1] in list(range(210, 256)) and item[2] in list(range(210, 256)):
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)

trans_img = Image.new("RGBA", img.size)
trans_img.putdata(new_data)

trans_img.save(output_full_trans, "PNG")

# Overwrite old copies
trans_img.save(r"C:\Projects\AA\SS_12_26\frontend\src\assets\logo.png", "PNG")
trans_img.save(r"C:\Projects\AA\SS_12_26\frontend\public\logo.png", "PNG")
# Keep iOS/Android app icons solid white background or transparent? Usually solid is fine, but we will make them transparent for now 
trans_img.save(r"C:\Projects\AA\SS_12_26\frontend\resources\icon.png", "PNG")
trans_img.save(r"C:\Projects\AA\SS_12_26\frontend\resources\splash.png", "PNG")

# Create a white text version for dark mode login screen
white_data = []
for item in new_data:
    if item[3] > 0:
        # If it's a dark color (like black text), make it white
        if item[0] < 80 and item[1] < 80 and item[2] < 80:
            white_data.append((255, 255, 255, item[3]))
        else:
            white_data.append(item)
    else:
        white_data.append((255, 255, 255, 0))
white_img = Image.new("RGBA", trans_img.size)
white_img.putdata(white_data)
white_img.save(output_full_white, "PNG")


# Now crop the icon out:
# Usually the top portion of the logo is the icon. Let's just crop the top 60% where non-transparent pixels exist.
bbox = trans_img.getbbox()
if bbox:
    x1, y1, x2, y2 = bbox
    # Let's crop from y1 to y1 + (x2 - x1) to make it square
    width = x2 - x1
    crop_height = min(y2, y1 + width)
    
    icon_img = trans_img.crop((x1, y1, x2, crop_height))
    
    # center it in a square
    max_dim = max(icon_img.size)
    bg = Image.new("RGBA", (max_dim, max_dim), (255,255,255,0))
    bg.paste(icon_img, ((max_dim - icon_img.size[0]) // 2, (max_dim - icon_img.size[1]) // 2))
    bg.save(output_bookmark, "PNG")

print("Processing complete.")
