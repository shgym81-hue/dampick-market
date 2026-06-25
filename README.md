# DAMPICK 공동구매 마켓 기본 앱 템플릿

카카오톡에 URL을 공유하면 고객이 상품 목록을 보고, 장바구니에 담고, 결제 화면까지 이동할 수 있는 모바일형 웹앱 기본 틀입니다.

## 파일 구성

- `index.html` : 화면 구조
- `style.css` : 보라색 앱 디자인, 모바일 최적화
- `app.js` : 상품 데이터, 장바구니, 결제 흐름
- `assets/storefront.jpg` : 단픽 매장 정면 이미지
- `assets/product-*.svg` : 샘플 상품 이미지

## 상품 수정 방법

`app.js` 상단의 `products` 배열을 수정하세요.

```js
{
  id: 5,
  category: "과일",
  name: "초당옥수수(국산) 1봉(5개)",
  pickup: "내일(금) 픽업",
  remain: 12,
  price: 5900,
  soldout: false,
  image: "assets/product-corn.svg"
}
```

- `category`는 `전체 / 과일 / 밀키트 / 기타` 탭과 연결됩니다.
- `soldout: true`로 바꾸면 품절 표시가 됩니다.
- `remain`은 잔여 수량입니다.
- `price`는 숫자만 입력하세요.

## GitHub Pages 올리는 순서

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더 안의 파일을 전부 업로드합니다.
3. 저장소의 `Settings` → `Pages`로 이동합니다.
4. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
5. Branch는 `main`, 폴더는 `/root`로 선택하고 저장합니다.
6. 생성된 주소를 카카오톡에 붙여넣으면 됩니다.

## 실제 결제 연동 안내

이 템플릿의 결제 버튼은 화면 흐름 확인용입니다. 실제 카드 결제를 받으려면 아래 중 하나가 필요합니다.

- Toss Payments / PortOne / KG이니시스 같은 PG사 계약
- 주문 정보와 결제 검증을 처리하는 서버
- 사업자 정보, 통신판매업/전자결제 관련 운영 정책 확인

처음에는 `현장 결제/계좌이체` 방식으로 주문 접수형으로 운영하고, 이후 PG 결제를 붙이는 방식이 가장 빠릅니다.
