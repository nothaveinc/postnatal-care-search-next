import type { CareType } from "./subsidy";

export type Availability = "ok" | "few";
export type PhotoVariant = "a" | "b" | "c";

export type Review = {
  name: string;
  date: string;
  rating: number;
  text: string;
};

export type Facility = {
  id: string;
  name: string;
  careType: CareType;
  area: string;
  prefecture: string;
  addressDetail: string;
  rating: number;
  reviewCount: number;
  features: string[];
  priceUnit: string;
  price: number;
  subsidyApplicable: boolean;
  availability: Availability;
  icon: string;
  photoVariant: PhotoVariant;
  description: string;
  access: string;
  hours: string;
  reviews: Review[];
};

export const AREAS = ["世田谷区", "杉並区", "横浜市", "武蔵野市", "川崎市"] as const;

export const CARE_TYPE_OPTIONS: CareType[] = ["宿泊型", "通所型", "訪問型"];

export const FEATURE_OPTIONS = [
  "母乳ケア",
  "メンタルケア",
  "多胎児対応",
  "上の子同伴可",
  "公費助成対象",
] as const;

export const facilities: Facility[] = [
  {
    id: "mamys-house-seijo",
    name: "マミーズハウス成城",
    careType: "宿泊型",
    area: "世田谷区",
    prefecture: "東京都",
    addressDetail: "東京都世田谷区成城",
    rating: 4.8,
    reviewCount: 126,
    features: ["母乳ケア", "上の子同伴可", "公費助成対象"],
    priceUnit: "1泊",
    price: 8000,
    subsidyApplicable: true,
    availability: "ok",
    icon: "🏥",
    photoVariant: "a",
    description:
      "助産師が24時間常駐する宿泊型の産後ケア施設です。個室でゆっくり休みながら、授乳や沐浴の指導、育児相談を受けられます。上の子の同伴にも対応しています。",
    access: "小田急線 成城学園前駅より徒歩8分",
    hours: "24時間対応（チェックイン15:00〜/チェックアウト11:00）",
    reviews: [
      {
        name: "A・Kさん",
        date: "2026年5月",
        rating: 5,
        text: "初めての育児で不安でしたが、助産師さんが丁寧に授乳指導してくれて安心できました。部屋も清潔で快適でした。",
      },
      {
        name: "M・Sさん",
        date: "2026年3月",
        rating: 5,
        text: "上の子も一緒に泊まれたのが助かりました。公費助成の申請方法も教えていただけました。",
      },
    ],
  },
  {
    id: "suginami-komorebi",
    name: "杉並産後ケアセンター こもれび",
    careType: "通所型",
    area: "杉並区",
    prefecture: "東京都",
    addressDetail: "東京都杉並区阿佐谷",
    rating: 4.6,
    reviewCount: 89,
    features: ["母乳ケア", "メンタルケア", "公費助成対象"],
    priceUnit: "1日",
    price: 3000,
    subsidyApplicable: true,
    availability: "ok",
    icon: "🌿",
    photoVariant: "b",
    description:
      "日帰りで利用できる通所型の産後ケア施設です。授乳相談や体調チェックに加え、助産師によるメンタルケア面談も受けられます。",
    access: "JR中央線 阿佐ケ谷駅より徒歩5分",
    hours: "9:00〜17:00（日曜・祝日休み）",
    reviews: [
      {
        name: "R・Tさん",
        date: "2026年6月",
        rating: 5,
        text: "産後の不安な気持ちを聞いてもらえて、気持ちが軽くなりました。",
      },
    ],
  },
  {
    id: "yokohama-yurikago",
    name: "よこはま助産師ステーション ゆりかご",
    careType: "訪問型",
    area: "横浜市",
    prefecture: "神奈川県",
    addressDetail: "神奈川県横浜市港北区",
    rating: 4.9,
    reviewCount: 204,
    features: ["母乳ケア", "多胎児対応"],
    priceUnit: "1回",
    price: 5500,
    subsidyApplicable: false,
    availability: "few",
    icon: "🏠",
    photoVariant: "c",
    description:
      "助産師がご自宅に訪問し、授乳・沐浴指導や産後の体調チェックを行います。双子・三つ子など多胎児のご家庭にも豊富な実績があります。",
    access: "横浜市港北区内・近隣エリアに訪問対応",
    hours: "9:00〜18:00（要予約）",
    reviews: [
      {
        name: "N・Iさん",
        date: "2026年4月",
        rating: 5,
        text: "双子の育児で余裕がない中、自宅に来てもらえてとても助かりました。多胎児のケアに詳しくて安心です。",
      },
    ],
  },
  {
    id: "kichijoji-ladies-clinic",
    name: "吉祥寺レディースクリニック 産後ケア棟",
    careType: "宿泊型",
    area: "武蔵野市",
    prefecture: "東京都",
    addressDetail: "東京都武蔵野市吉祥寺",
    rating: 4.5,
    reviewCount: 67,
    features: ["メンタルケア", "公費助成対象"],
    priceUnit: "1泊",
    price: 12000,
    subsidyApplicable: true,
    availability: "ok",
    icon: "🛏️",
    photoVariant: "b",
    description:
      "産婦人科クリニックに併設された宿泊型の産後ケア施設です。医師と連携した体調管理と、助産師によるメンタルケアを受けられます。",
    access: "JR中央線 吉祥寺駅より徒歩10分",
    hours: "24時間対応（チェックイン14:00〜/チェックアウト11:00）",
    reviews: [
      {
        name: "K・Yさん",
        date: "2026年2月",
        rating: 4,
        text: "クリニック併設で何かあったときの安心感がありました。",
      },
    ],
  },
  {
    id: "setagaya-nikoniko-room",
    name: "せたがや母子デイケア にこにこルーム",
    careType: "通所型",
    area: "世田谷区",
    prefecture: "東京都",
    addressDetail: "東京都世田谷区三軒茶屋",
    rating: 4.3,
    reviewCount: 52,
    features: ["多胎児対応", "上の子同伴可", "公費助成対象"],
    priceUnit: "1日",
    price: 2500,
    subsidyApplicable: true,
    availability: "ok",
    icon: "🍼",
    photoVariant: "a",
    description:
      "上の子連れや多胎児のご家庭も安心して通える日帰り型の産後ケア施設です。育児相談スペースと授乳室を完備しています。",
    access: "東急田園都市線 三軒茶屋駅より徒歩6分",
    hours: "9:30〜16:30（土日休み）",
    reviews: [
      {
        name: "H・Mさん",
        date: "2026年6月",
        rating: 4,
        text: "上の子を遊ばせながら赤ちゃんのケアもしてもらえて助かりました。",
      },
    ],
  },
  {
    id: "kawasaki-hagukumi",
    name: "かわさき訪問産後ケア はぐくみ",
    careType: "訪問型",
    area: "川崎市",
    prefecture: "神奈川県",
    addressDetail: "神奈川県川崎市中原区",
    rating: 4.7,
    reviewCount: 113,
    features: ["母乳ケア", "メンタルケア", "公費助成対象"],
    priceUnit: "1回",
    price: 4000,
    subsidyApplicable: true,
    availability: "few",
    icon: "🤱",
    photoVariant: "c",
    description:
      "助産師が自宅を訪問し、授乳相談・沐浴指導・メンタルケアをトータルでサポートします。公費助成の申請サポートも行っています。",
    access: "川崎市中原区内・近隣エリアに訪問対応",
    hours: "9:00〜17:00（要予約）",
    reviews: [
      {
        name: "S・Fさん",
        date: "2026年5月",
        rating: 5,
        text: "話をじっくり聞いてもらえて、産後の不安が和らぎました。",
      },
    ],
  },
  {
    id: "yokohama-sakura",
    name: "横浜バースケアハウス さくら",
    careType: "宿泊型",
    area: "横浜市",
    prefecture: "神奈川県",
    addressDetail: "神奈川県横浜市青葉区",
    rating: 4.4,
    reviewCount: 78,
    features: ["母乳ケア", "多胎児対応", "公費助成対象"],
    priceUnit: "1泊",
    price: 9500,
    subsidyApplicable: true,
    availability: "ok",
    icon: "🌸",
    photoVariant: "b",
    description:
      "落ち着いた住宅街にある宿泊型の産後ケアハウスです。個室でのんびり過ごしながら、母乳育児のサポートを受けられます。",
    access: "東急田園都市線 青葉台駅よりバス10分",
    hours: "24時間対応（チェックイン15:00〜/チェックアウト11:00）",
    reviews: [
      {
        name: "Y・Oさん",
        date: "2026年3月",
        rating: 4,
        text: "静かな環境でゆっくり休めました。母乳マッサージも丁寧でした。",
      },
    ],
  },
  {
    id: "ogikubo-sora",
    name: "荻窪マタニティケアホーム そら",
    careType: "宿泊型",
    area: "杉並区",
    prefecture: "東京都",
    addressDetail: "東京都杉並区荻窪",
    rating: 4.2,
    reviewCount: 41,
    features: ["メンタルケア", "上の子同伴可"],
    priceUnit: "1泊",
    price: 15000,
    subsidyApplicable: false,
    availability: "few",
    icon: "🕊️",
    photoVariant: "a",
    description:
      "上の子連れでも安心して過ごせるファミリー向けの宿泊型ケアホームです。カウンセラーによるメンタルケア面談も予約できます。",
    access: "JR中央線 荻窪駅より徒歩12分",
    hours: "24時間対応（チェックイン15:00〜/チェックアウト11:00）",
    reviews: [
      {
        name: "T・Nさん",
        date: "2026年4月",
        rating: 4,
        text: "上の子と一緒に泊まれる施設が少ない中、とても助かりました。",
      },
    ],
  },
  {
    id: "musashino-hidamari",
    name: "むさしのデイケア ひだまり",
    careType: "通所型",
    area: "武蔵野市",
    prefecture: "東京都",
    addressDetail: "東京都武蔵野市境南町",
    rating: 4.6,
    reviewCount: 95,
    features: ["母乳ケア", "公費助成対象"],
    priceUnit: "1日",
    price: 3500,
    subsidyApplicable: true,
    availability: "ok",
    icon: "☀️",
    photoVariant: "c",
    description:
      "明るく広々とした空間で、授乳相談・沐浴指導・育児相談を日帰りで受けられる通所型の産後ケア施設です。",
    access: "JR中央線 三鷹駅よりバス8分",
    hours: "9:00〜17:00（日曜休み）",
    reviews: [
      {
        name: "C・Wさん",
        date: "2026年6月",
        rating: 5,
        text: "スタッフの方が皆さん優しく、リラックスして過ごせました。",
      },
    ],
  },
];

export function getFacilityById(id: string): Facility | undefined {
  return facilities.find((f) => f.id === id);
}
