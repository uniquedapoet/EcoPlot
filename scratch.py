import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

# Target URL
URL = "https://www.rhs.org.uk/plants/91403/epipremnum-aureum/details"

# Set up Selenium WebDriver
options = Options()
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--headless")  # Run in headless mode
options.add_argument("--window-size=1920,1080")  # Ensure all content loads properly

# Start WebDriver
service = Service("/opt/homebrew/bin/chromedriver")  # Adjust if using Intel Mac
driver = webdriver.Chrome(service=service, options=options)

def get_plant_data(url):
    """Fetches and parses plant attributes from a JavaScript-rendered webpage."""
    driver.get(url)

    # Wait for plant attributes section to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "plant-attributes__panel"))
    )

    # Get page source after JS execution
    soup = BeautifulSoup(driver.page_source, "html.parser")

    plant_info = {}

    # Loop through all "plant-attributes__panel" sections
    panels = soup.find_all("div", class_="plant-attributes__panel")

    for panel in panels:
        section_title = panel.find("h6", class_="plant-attributes__heading")
        if not section_title:
            continue  # Skip if no heading

        section_name = section_title.text.strip()

        # **1️⃣ Extract "Size" Section**
        if section_name == "Size":
            flags = panel.find_all("div", class_="flag__body")
            for flag in flags:
                label = flag.find("h6", class_="text-small u-m-b-0")
                if label:
                    value = flag.text.replace(label.text, "").strip()
                    plant_info[label.text.strip()] = value

        # **2️⃣ Extract "Growing Conditions" Section**
        elif section_name == "Growing conditions":
            # Extract soil types
            soil_types = [div.text.strip() for div in panel.find_all("div", class_="flag__body")]
            if soil_types:
                plant_info["Soil Types"] = ", ".join(soil_types)

            # Extract moisture
            moisture_header = panel.find("h6", string="Moisture")
            if moisture_header:
                moisture = moisture_header.find_next("span").text.strip()
                plant_info["Moisture"] = moisture

            # Extract pH values
            ph_header = panel.find("h6", string="pH")
            if ph_header:
                ph_values = [span.text.strip() for span in ph_header.find_parent("div").find_all("span", class_="ng-star-inserted")]
                plant_info["pH"] = ", ".join(ph_values)

        # **3️⃣ Extract "Position" Section**
        elif section_name == "Position":
            # Extract Sunlight Conditions (Full Sun, Partial Shade)
            sunlight_conditions = [div.text.strip() for div in panel.find_all("div", class_="flag__body u-w-auto")]
            if sunlight_conditions:
                plant_info["Sunlight"] = ", ".join(sunlight_conditions)

            # Extract Aspect (West-facing, South-facing)
            aspect_header = panel.find("h6", string="Aspect")
            if aspect_header:
                aspect_values = [span.text.strip() for span in aspect_header.find_next_siblings("span")]
                plant_info["Aspect"] = " ".join(aspect_values)

            # Extract Exposure (Sheltered)
            exposure_header = panel.find("h6", string="Exposure")
            if exposure_header:
                exposure = exposure_header.find_next("span").text.strip()
                plant_info["Exposure"] = exposure

            # Extract Hardiness (e.g., H1B)
            hardiness_header = panel.find("h6", string=lambda text: text and "Hardiness" in text)
            if hardiness_header:
                hardiness = hardiness_header.find_next("span").text.strip()
                plant_info["Hardiness"] = hardiness

        # **4️⃣ Extract "Colour & Scent" Section**
        elif section_name == "Colour & scent":
            plant_info["Colour & Scent"] = {}

            # Locate the table
            table = panel.find("table", class_="table--plant-details")
            if table:
                rows = table.find_all("tr")

                for row in rows[1:]:  # Skip header row
                    columns = row.find_all("td")
                    season = row.find("th").text.strip()

                    plant_info["Colour & Scent"][season] = {}

                    categories = ["Stem", "Flower", "Foliage", "Fruit"]
                    for index, category in enumerate(categories):
                        # Extract colors inside tooltips
                        colors = [tooltip.text.strip() for tooltip in columns[index].find_all("span", class_="tooltip-v2__content")]
                        if colors:
                            plant_info["Colour & Scent"][season][category] = ", ".join(colors)
    driver.quit()
    
    return plant_info


# # Run the scraper
# plant_data = get_plant_data(URL)
# driver.quit()  # Close browser

# # Print results
# if plant_data:
#     print("🌱 Plant Attributes:")
#     for key, value in plant_data.items():
#         if isinstance(value, dict):
#             print(f"{key}:")
#             for subkey, subvalue in value.items():
#                 print(f"  {subkey}: {subvalue}")
#         else:
#             print(f"{key}: {value}")

def get_plant_links(start_page=1, end_page=1):
    """Scrape plant links from RHS website"""
    plant_links = []

    for page in range(start_page, end_page + 1):
        BASE_URL = "https://www.rhs.org.uk/plants/search-results?page={}"
        url = BASE_URL.format(page)
        print(f"Scraping page: {url}")

        driver.get(url)

        try:
            # Wait for plant listings to load
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.CLASS_NAME, "gl-view__item"))
            )

            # Get page source and parse with BeautifulSoup
            soup = BeautifulSoup(driver.page_source, "html.parser")

            # Extract all plant links
            plant_items = soup.find_all("a", class_="u-faux-block-link__overlay")
            for plant in plant_items:
                link = plant.get("href")
                if link and "/plants/" in link:
                    full_link = "https://www.rhs.org.uk" + link
                    plant_links.append(full_link)

        except Exception as e:
            print(f"❌ Error scraping page {page}: {e}")

        time.sleep(2)  # Avoid overwhelming the server

    driver.quit()
    return plant_links

# Run the scraper
plant_links = get_plant_links(start_page=1, end_page=5)

# Print results
print("\n🌱 Extracted Plant Links:")
for link in plant_links:
    print(link)
