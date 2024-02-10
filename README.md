
# 날씨 정보 web project
## 사용 라이브러리
- api 통신 : axios
- 그래프 : chart.js
- CSS 라이브러리 : tailwindcss
- Class 결합 : clsx
- api 인증키 관리 : dotenv

## 작업 전 목표
- 현재위치 조회
  - 현재위치 정보를 바탕으로 날씨, 기온, 대기 등의 정보를 조회함.
- 날씨 정보
  - 현재 날씨를 표시
- 시간대별 날씨
  - line 그래프
- 대기질 정보
  - 초미세먼지 (pie 그래프)
  - 미세먼지 (pie 그래프)
  - 오존 (pie 그래프)
- 기온 정보
  - 최저온도
  - 최고온도
  - 현재온도

## 사용자 경험
- 반응형
  - 데스크탑(가로 1920dpi)
  - 모바일(가로 420dpi)
 
## 자료 조사
 - api 정보
   - [한국천문연구원_출몰시각 정보](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15012688)
   - [기상청_단기예보 ((구)_동네예보) 조회서비스](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15084084)
   - [한국환경공단_에어코리아_대기오염정보](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15073861)
   - [한국환경공단_에어코리아_측정소정보](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15073877)
  
## UI 설계
> ![image](https://github.com/Dev-ShinY/study_weather/assets/114058540/2821149a-3af1-49d6-a8a3-e10687951d8d)

## 반응형 화면
### 데스크탑
> ![image](https://github.com/Dev-ShinY/study_weather/assets/114058540/8e1014a7-823f-4cd3-9d85-27d589d76ea2)
> ![image](https://github.com/Dev-ShinY/study_weather/assets/114058540/c7e7580b-88e7-41d1-bbc4-295834e7e6ea)

### 모바일
> ![image](https://github.com/Dev-ShinY/study_weather/assets/114058540/141fbf61-273f-45c2-b4c3-49ac4f0d09f0)

## 개발 이슈
- 인증 키 관리
  > ![image](https://github.com/Dev-ShinY/study_weather/assets/114058540/35a08e43-6f7f-4dde-a781-0fa3a65a6f0e)
  > api 인증키를 dotenv로 관리하여 인증키 관리
  
- gitmoji
  > ![image](https://github.com/Dev-ShinY/study_weather/assets/114058540/04cb12e2-1318-488a-8459-87253324ebdd)
  > [gitmoji](https://gitmoji.dev) 로 커밋명을 관리하여 직관성

- css 라이브러리는 tailwindcss로 선택
  - 빠르게 스타일링을 할 수 있으면서도 디자인 시스템만큼이나 일관된 디자인을 가능함
  - 반응형으로 쉽게 적용이 가능
 
