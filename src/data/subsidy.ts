export type CareType = "宿泊型" | "通所型" | "訪問型";

export type PrefectureSubsidy = {
  hasSubsidy: boolean;
  maxDays: number;
  types: Record<CareType, { fullPrice: number; subsidy: number }>;
  lowIncomeDiscount: number;
  welfareDiscount: number;
  applicationMethod: string[];
  applicationUrl?: string;
  note: string;
  deadline: string;
};

export const subsidyData: Record<string, PrefectureSubsidy> = {
  東京都: {
    hasSubsidy: true,
    maxDays: 7,
    types: {
      宿泊型: { fullPrice: 30000, subsidy: 25000 },
      通所型: { fullPrice: 10000, subsidy: 8000 },
      訪問型: { fullPrice: 8000, subsidy: 7000 },
    },
    lowIncomeDiscount: 0.5,
    welfareDiscount: 1.0,
    applicationMethod: ["オンライン申請", "区市町村窓口"],
    applicationUrl: "https://example.tokyo.lg.jp/postnatal",
    note: "利用の2週間前までに申請が必要です。",
    deadline: "産後4ヶ月未満",
  },
  大阪府: {
    hasSubsidy: true,
    maxDays: 5,
    types: {
      宿泊型: { fullPrice: 28000, subsidy: 22000 },
      通所型: { fullPrice: 9000, subsidy: 7000 },
      訪問型: { fullPrice: 7500, subsidy: 6500 },
    },
    lowIncomeDiscount: 0.5,
    welfareDiscount: 1.0,
    applicationMethod: ["窓口申請のみ"],
    note: "利用の1週間前までに申請が必要です。",
    deadline: "産後4ヶ月未満",
  },
  神奈川県: {
    hasSubsidy: true,
    maxDays: 7,
    types: {
      宿泊型: { fullPrice: 29000, subsidy: 23000 },
      通所型: { fullPrice: 9500, subsidy: 7500 },
      訪問型: { fullPrice: 8000, subsidy: 7000 },
    },
    lowIncomeDiscount: 0.5,
    welfareDiscount: 1.0,
    applicationMethod: ["オンライン申請", "窓口申請"],
    note: "市区町村によって助成額が異なる場合があります。",
    deadline: "産後4ヶ月未満",
  },
  愛知県: {
    hasSubsidy: true,
    maxDays: 5,
    types: {
      宿泊型: { fullPrice: 25000, subsidy: 18000 },
      通所型: { fullPrice: 8000, subsidy: 6000 },
      訪問型: { fullPrice: 7000, subsidy: 5500 },
    },
    lowIncomeDiscount: 0.5,
    welfareDiscount: 1.0,
    applicationMethod: ["窓口申請"],
    note: "",
    deadline: "産後6ヶ月未満",
  },
  福岡県: {
    hasSubsidy: true,
    maxDays: 7,
    types: {
      宿泊型: { fullPrice: 22000, subsidy: 17000 },
      通所型: { fullPrice: 7500, subsidy: 5500 },
      訪問型: { fullPrice: 6500, subsidy: 5000 },
    },
    lowIncomeDiscount: 0.5,
    welfareDiscount: 1.0,
    applicationMethod: ["オンライン申請", "窓口申請"],
    note: "市区町村によって異なります。",
    deadline: "産後4ヶ月未満",
  },
  _default: {
    hasSubsidy: true,
    maxDays: 5,
    types: {
      宿泊型: { fullPrice: 22000, subsidy: 15000 },
      通所型: { fullPrice: 7000, subsidy: 5000 },
      訪問型: { fullPrice: 6000, subsidy: 4500 },
    },
    lowIncomeDiscount: 0.5,
    welfareDiscount: 1.0,
    applicationMethod: ["お住まいの市区町村窓口にお問い合わせください"],
    note: "※助成額は自治体により異なります。最新情報は各市区町村にご確認ください。",
    deadline: "産後4ヶ月未満（自治体により異なる）",
  },
};

export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];
