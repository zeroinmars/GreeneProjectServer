#필수impor
from selenium import webdriver # 웹드라이버. 코랩이라 우리가 직접 볼 순 없지만 얘가 돌아다니면서 일을 해줌
from selenium.webdriver.common.by import By # element를 찾을 때 쓰이는 parameter를 불러오는 역할
import sys #파이썬내장모듈, child_process와 연동(아규먼트받기)

#크롬 드라이버의 각종 옵션들 생성 및 적용.
options = webdriver.ChromeOptions()
options.add_argument('--headless') # 화면없이 실행
options.add_argument('--no-sandbox')
options.add_argument('--single-process')
options.add_argument('--disable-dev-shm-usage')

# 구글에 user agent 검색
options.add_argument('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36') # 나는 기계가 아니고 사람이에요
driver = webdriver.Chrome('chromedriver', options=options)

import time#딜레이
def main(sName,eName):
    # 드라이버로 링크 접속 sName은 출발지 eName은 도착지
    driver.get(f'http://map.kakao.com/?sName={sName}&eName={eName}')
    time.sleep(2) #second
    # xpath 이용 태그 가져오기
    # 자가용
    print(driver.find_element(By.XPATH, '//*[@id="info.flagsearch"]/div[6]/ul/li/div[1]/div/div[1]/p/span[1]').text)
    # 대중교통
    # driver.find_element(By.XPATH, '//*[@id="transittab"]').click()
    # time.sleep(3)
    # print(driver.find_element(By.XPATH, '//*[@id="info.flagsearch"]/div[5]/ul/li[1]/div[1]/span[1]').text)

if __name__ == '__main__':
    main(sys.argv[1],sys.argv[2])
    #main('광주동구서남로1','광주서구내방로241번길10')
#if __name__ == '__main__':
#print('11','22')