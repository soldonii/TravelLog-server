![cover](./readmeAssets/cover.png)

# TravelLog

## 1. Introduction
평소 여행을 다닐 때마다 여행 관련된 모든 지출을 기록하고, 한 눈에 파악할 수 있는 서비스가 없어 불편함을 느꼈습니다.
**TravelLog**는 이러한 불편을 해소하기 위해 항공권, 숙소 및 여행지에서의 지출 내용을 기록하고 한 눈에 확인할 수 있도록 제작됩 웹 어플리케이션입니다.


## 2. Preview
- https://www.travellog.live
![TravelLog Preview](./readmeAssets/travellog.gif)


## 3. Features
- KakaoTalk Social Login
- Kayak.com Crawling
- Airbnb Crawling
- Chart.js를 이용한 지출 시각화
- Google Maps API를 이용한 지출장소 지도 표시
- 다수의 여행지 지출 내역 저장/불러오기 기능
- 지출 내역 등록/수정/삭제 기능
- Currency API를 이용, 환율을 적용하여 지출액을 한화로 자동 변환 기능


## 4. Requirements
- 최신 Chrome Browser의 사용을 권장합니다.


## 5. Prerequisites
### Client
`.env` 파일을 생성하고 아래 `<>`에 환경변수를 입력한 후, root 디렉토리에 저장해야 합니다.

```
REACT_APP_KAKAO_KEY=<kakao key>
REACT_APP_SERVER_URI=https://travellog-server.herokuapp.com
REACT_APP_GOOGLE_MAP_URL=https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=
REACT_APP_GOOGLE_API_KEY=<google map api key>
```

### Server
`.env` 파일을 생성하고 아래 `<>`에 환경변수를 입력한 후, root 디렉토리에 저장해야 합니다.

```
PORT=8080
AIRBNB_SEARCH_URI_FRONT=https://airbnb.co.kr/s/
AIRBNB_SEARCH_URI_MID=/homes?tab_id=all_tab&refinement_paths%5B%5D=%2Fhomes&
AIRBNB_SEARCH_URI_BACK=&adults=1&source=structured_search_input_header&search_type=search_query
KAYAK_URI_FRONT=https://kayak.co.kr/flights/ICN-

CURRENCY_API_ENDPOINT=http://api.currencylayer.com/live?access_key=<access-key>

JWT_SECRET_KEY=<jwt-secret-key>
MONGODB_URI=<mongoDB-connection-string>
```


## 6. Installation
### Client
```
git clone https://github.com/soldonii/TravelLog-client.git
cd TravelLog-client

## 위에서 생성한 .env 파일을 root 디렉토리에 추가합니다.
npm install
npm start
```

### Server
```
git clone https://github.com/soldonii/TravelLog-server.git
cd TravelLog-server

## 위에서 생성한 .env 파일을 root 디렉토리에 추가합니다.
npm install
npm start
```


## 7. Skills
### 1) Client
- ES2015+
- React
- React Router
- Redux
- Redux Persist
- KakaoTalk Social Login
- Google Maps API
- Chart.js
- Styled-Components

### 2) Server
- ES2015+
- TypeScript
- Puppeteer
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Token

### 3) Tests
- Jest, Enzyme을 이용한 Unit test 작성


## 8. Project Control
- Version Control: Git, Gitlab
- Task Control: Trello


## 9. Deployment
- Client: Netlify
- Server: Heroku


## 10. Challenges
2주 간 본 프로젝트를 진행하면서 겪었던 기술적 어려움들은 아래와 같습니다.

### 1) TypeScript 적용하기
바닐라코딩 부트캠프 기간 동안 매주 여러 어플리케이션들을 제작했지만, 제 코드에는 언제나 크고 작은 에러들이 존재했습니다. 에러를 줄이기 위해 로직에 견고함을 더해야겠지만, TypeScript를 도입해서 타입을 정확히 지정해주면 실제 배포 환경에서 에러를 더 많이 줄일 수 있지 않을까 생각만 해 왔습니다. 본 프로젝트에서 그 동안의 생각을 실천으로 옮기고 싶었고, 2주라는 제한된 개발 시간과 TypeScript를 한 번도 학습해본 적이 없다는 점을 감안하여 프론트엔드와 백엔드 중 한 곳에만 우선적으로 TypeScript를 적용하기로 결정했습니다.

상대적으로 error handling의 중요성이 더 높은 백엔드에 TypeScript를 적용하여 개발을 진행했는데, TypeScript의 사용법, compile option, type을 지정하고 interface를 작성하는 방법 등을 익히면서 개발하다보니 TypeScript를 적용하지 않을 때에 비해 동일한 작업도 시간이 서너배씩 걸리곤 했습니다. TypeScript가 발생시키는 무수한 에러들을 해결하는 과정도 쉽지는 않았지만, 제한된 기간으로 인해 심적으로 여유가 없는 상황에서 TypeScript는 모래주머니를 달고 달리는 것 같은 느낌을 더해주었고, 이로 인한 심적 부담감을 극복하는 것 또한 쉽지 않았습니다.

TypeScript를 정확하게, 올바른 방식으로 사용했다고 자신하기는 어렵지만 이번 경험을 토대로 TypeScript의 기초적인 활용 방법을 익힐 수 있었고, 추가적으로 학습한다면 TypeScript를 적용한 개발에 조금 더 자신감을 가지게 된 좋은 경험이었습니다.

### 2) Puppeteer를 이용한 Crawling
TypeScript와 더불어 Crawling 또한 처음으로 적용해보는 기술 중 하나였습니다. Crawling 방법 자체가 어렵진 않았지만, 웹사이트에서 bot 인식 여부에 대한 가설 검증 없이 진행했던 부분이 아쉬웠습니다. 회사에서는 가설을 세우고 pre 검증을 통해 실현 가능성 여부를 빠르게 판단한 후 진행하는데, 해당 과정 없이 skyscanner를 crawling하기 위해 로직을 모두 세팅해 놓았다가, puppeteer를 이용한 사이트 접속 시 bot으로 인식하여 reCAPTCHA 이슈를 해결해야 하는 난관에 봉착했습니다. 무작위로 신호등, 버스 등이 등장한 사진을 골라야 하는 reCAPTCHA 이슈를 해결하기는 기술적 난이도가 너무 높아, 결국 skyscanner가 아닌 kayak으로 항공권 crawling 대상 site를 변경하는 과정에서 꽤 많은 시간이 낭비되었습니다.

이번 경험을 토대로 다시 한 번 pre 검증의 중요성에 대해서 체감하게 되었고, 추후에는 특정 업무를 진행하기 위한 논리를 완벽하게 세우기 전에, 실현 가능성에 대해서 빠르게 검토한 후 진행하여 업무의 진행 속도를 올릴 수 있을 것 같습니다.


## 11. Things to do
- crawling 로직 update : 현재 crawling 로직은 하나의 selector를 찾고 해당 정보를 긁어오는 과정의 반복으로 이루어져 있습니다. 하지만 각 비동기 작업이 서로에게 영향을 미치지 않는 독립적인 작업임에도 불구하고, 하나의 비동기 작업이 완료된 후 다른 비동기 작업을 반복적으로 수행하는 현재의 로직인 비효율적임을 프로젝트의 후반부에 깨닫게 되었습니다. 따라서 독립적인 여러 비동기 작업들을 `Promise.all`로 묶어 동시에 진행되도록 로직을 수정하면 crawling에 소요되는 시간을 상당히 줄일 수 있을 것으로 예상되어 해당 로직의 update를 진행하고자 합니다.

- React Component 수정 : 일부 React Container에 과다하게 많은 props가 전달되고 있어, 이를 분산시켜 더 간결한 Container로의 update가 필요합니다.
