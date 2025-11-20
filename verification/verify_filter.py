
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # 1. Go to the skill selection page
        page.goto("http://localhost:8000/skill-selection.html")

        # Wait for data to load (check if current step is 'ブキ')
        page.wait_for_selector("#current-step", state="visible")

        # 2. Click the Filter Button
        page.click("#filter-btn")

        # 3. Wait for Modal to appear
        page.wait_for_selector("#filter-modal", state="visible")

        # 4. Interact with tabs
        # Click 'アタマ' (Head) tab
        page.click("button[data-tab='filter-head']")
        page.wait_for_selector("#filter-head", state="visible")

        # 5. Uncheck the first item in Head
        first_checkbox = page.locator("#list-head input[type='checkbox']").first
        first_checkbox.uncheck()

        # Take a screenshot of the open modal with an unchecked item
        page.screenshot(path="verification/filter_modal_interaction.png")

        # 6. Close modal
        page.click("#close-filter-btn")
        page.wait_for_selector("#filter-modal", state="hidden")

        print("Verification script completed successfully.")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
