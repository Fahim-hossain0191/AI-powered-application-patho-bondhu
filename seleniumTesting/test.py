from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Initialize Chrome
driver = webdriver.Chrome()

try:
    # 1. Load local dev environment
    driver.maximize_window()
    driver.get("http://localhost:3000")
    time.sleep(3)

    # 2. Find and click the Sign In link/button
    sign_in_link = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//a[@href='/signin']")) 
    )
    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", sign_in_link)
    time.sleep(3)
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//a[@href='/signin']"))
    ).click()
    print("Navigated to the Sign In page.")

    # 3. Fill out the login form
    email_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "signin-contact"))
    )
    password_input = driver.find_element(By.ID, "signin-password")
    submit_button = driver.find_element(By.ID, "signin-submit")

    email_input.send_keys("test@example.com")
    password_input.send_keys("test@1234")
    submit_button.click()
    print("Logged in successfully.")

    # 4. Click the Math workspace card
    math_card = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//a[@href='/math']"))
    )
    time.sleep(3)
    math_card.click()
    print("Entered the Math workspace.")

    # 5. Click the Open button
    open_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//span[text()='Open']"))
    )
    open_button.click()

    # 6. Scroll down and click the Practice button
    practice_btn = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//button[.//span[contains(text(), 'অনুশীলনী প্রশ্ন')]]"))
    )
    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", practice_btn)
    time.sleep(1) 
    practice_btn.click()
    time.sleep(3)

    # 7. Scroll to the specific math question and click it
    question_span = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//span[contains(text(), 'x + y = 5')]"))
    )
    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", question_span)
    time.sleep(3)
    question_span.click()
    print("Selected the math problem.")

    # 8. Type the answer into the textarea
    answer_textarea = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//textarea[contains(@placeholder, 'খাতায় না লিখে চাইলে')]"))
    )
    solution_text = "x^2 - y^2 = (x+y)(x-y) = 5 * 3 = 15"
    answer_textarea.send_keys(solution_text)
    print(f"Typed the solution: {solution_text}")

    # 9. Click the final Submit
    final_submit_btn = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Submit']"))
    )
    final_submit_btn.click()
    print("Final answer submitted successfully!")

except Exception as e:
    print(f"An error occurred during execution: {e}")

finally:
    time.sleep(4) 
    driver.quit()

