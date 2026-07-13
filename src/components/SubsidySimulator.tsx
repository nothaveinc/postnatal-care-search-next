"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  PREFECTURES,
  subsidyData,
  type CareType,
  type PrefectureSubsidy,
} from "@/data/subsidy";

type Household = "general" | "lowIncome" | "welfare";

const HOUSEHOLD_LABELS: Record<Household, string> = {
  general: "一般世帯",
  lowIncome: "住民税非課税世帯",
  welfare: "生活保護受給世帯",
};

const CARE_TYPES: { value: CareType; icon: string; note: string }[] = [
  { value: "宿泊型", icon: "🏨", note: "（ショートステイ）" },
  { value: "通所型", icon: "🏥", note: "（デイサービス）" },
  { value: "訪問型", icon: "🚗", note: "（アウトリーチ）" },
];

type SimulationResult = {
  prefecture: string;
  household: Household;
  careType: CareType;
  days: number;
  babyAge: number;
  data: PrefectureSubsidy;
  totalOwn: number;
  totalFull: number;
  totalSubsidy: number;
  overMax: boolean;
  ageWarning: boolean;
};

function CountUpAmount({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value <= 0) return;
    const duration = 800;
    const steps = 40;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = 1 - Math.pow(1 - step / steps, 3);
      setDisplay(Math.round(value * progress));
      if (step >= steps) {
        clearInterval(timer);
        setDisplay(value);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return <>¥{display.toLocaleString()}</>;
}

export default function SubsidySimulator() {
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [household, setHousehold] = useState<Household>("general");
  const [careType, setCareType] = useState<CareType>("宿泊型");
  const [days, setDays] = useState(3);
  const [babyAge, setBabyAge] = useState(0);

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prefecture) {
      setResult(null);
      setError("都道府県を選択してください。");
      return;
    }
    setError(null);

    const data = subsidyData[prefecture] || subsidyData["_default"];
    const typeData = data.types[careType];

    const baseOwn = typeData.fullPrice - typeData.subsidy;

    let discountRate = 0;
    if (household === "welfare") {
      discountRate = data.welfareDiscount;
    } else if (household === "lowIncome") {
      discountRate = data.lowIncomeDiscount;
    }

    const discountedOwn = Math.floor(baseOwn * (1 - discountRate));
    const totalOwn = discountedOwn * days;
    const totalFull = typeData.fullPrice * days;
    const totalSubsidy =
      typeData.subsidy * days + Math.floor(baseOwn * discountRate) * days;

    const deadlineMonths = data.deadline.includes("6") ? 6 : 4;

    setResult({
      prefecture,
      household,
      careType,
      days,
      babyAge,
      data,
      totalOwn,
      totalFull,
      totalSubsidy,
      overMax: days > data.maxDays,
      ageWarning: babyAge >= deadlineMonths,
    });
  };

  useEffect(() => {
    if (result || error) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [result, error]);

  const isFree = result !== null && result.totalOwn === 0;

  const applicationSteps = result
    ? [
        <>母子健康手帳・マイナンバーカードなど必要書類を準備</>,
        <>利用したい施設を予約する</>,
        <>
          <strong>{result.data.applicationMethod.join(" または ")}</strong>{" "}
          で申請手続きを行う
        </>,
        <>利用当日、施設で自己負担分をお支払いください</>,
      ]
    : [];

  return (
    <div className="widget subsidy-widget">
      <div className="widget__header">
        <span className="widget__icon">💰</span>
        <h3 className="widget__title">自己負担額シミュレーター</h3>
        <p className="widget__subtitle">お住まいの情報を入力してください</p>
      </div>

      <div className="widget__body">
        <form className="subsidy-form" onSubmit={handleSubmit} noValidate>
          <fieldset className="subsidy-step">
            <legend className="subsidy-step__label">STEP 1 &nbsp;基本情報</legend>

            <div className="input-row">
              <div className="form-group">
                <label className="form-label" htmlFor="sub-prefecture">
                  都道府県 <span className="required">必須</span>
                </label>
                <select
                  className="form-select"
                  id="sub-prefecture"
                  value={prefecture}
                  onChange={(e) => setPrefecture(e.target.value)}
                  required
                >
                  <option value="">選択してください</option>
                  {PREFECTURES.map((p) => (
                    <option value={p} key={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sub-city">
                  市区町村
                </label>
                <input
                  className="form-input"
                  id="sub-city"
                  type="text"
                  placeholder="例：新宿区、横浜市"
                  autoComplete="off"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">
                世帯状況 <span className="required">必須</span>
              </span>
              <div className="radio-group">
                {(Object.keys(HOUSEHOLD_LABELS) as Household[]).map((value) => (
                  <label className="radio-label" key={value}>
                    <input
                      type="radio"
                      name="household"
                      value={value}
                      checked={household === value}
                      onChange={() => setHousehold(value)}
                    />
                    <span className="radio-box">{HOUSEHOLD_LABELS[value]}</span>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          <fieldset className="subsidy-step">
            <legend className="subsidy-step__label">STEP 2 &nbsp;利用内容</legend>

            <div className="form-group">
              <span className="form-label">
                利用形態 <span className="required">必須</span>
              </span>
              <div className="radio-group radio-group--type">
                {CARE_TYPES.map((t) => (
                  <label className="radio-label" key={t.value}>
                    <input
                      type="radio"
                      name="careType"
                      value={t.value}
                      checked={careType === t.value}
                      onChange={() => setCareType(t.value)}
                    />
                    <span className="radio-box">
                      <span className="radio-box__icon">{t.icon}</span>
                      {t.value}
                      <small>{t.note}</small>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="input-row">
              <div className="form-group">
                <label className="form-label" htmlFor="sub-days">
                  利用予定日数
                </label>
                <div className="range-group">
                  <input
                    className="range-input"
                    id="sub-days"
                    type="range"
                    min={1}
                    max={7}
                    step={1}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                  />
                  <output className="range-output">{days}日</output>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sub-age">
                  赤ちゃんの月齢
                </label>
                <select
                  className="form-select"
                  id="sub-age"
                  value={babyAge}
                  onChange={(e) => setBabyAge(Number(e.target.value))}
                >
                  {Array.from({ length: 7 }, (_, i) => (
                    <option value={i} key={i}>
                      {i}ヶ月
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <div className="form-group form-group--submit">
            <button type="submit" className="btn btn--primary btn--full">
              シミュレーションする
            </button>
          </div>
        </form>

        <div
          className="subsidy-result"
          aria-live="polite"
          hidden={!result && !error}
          ref={resultRef}
        >
          {error && <p className="result-error">⚠️ {error}</p>}

          {result && (
            <div className="result-card fade-in-up" key={JSON.stringify([result.prefecture, result.careType, result.household, result.days, result.babyAge])}>
              <div className="result-card__header">
                <span className="result-tag">
                  {result.prefecture} / {result.careType} /{" "}
                  {HOUSEHOLD_LABELS[result.household]}
                </span>
                <h4 className="result-card__title">シミュレーション結果</h4>
              </div>

              <div className="result-card__amount">
                <p className="result-amount__label">
                  推定自己負担額（{result.days}日分）
                </p>
                <p
                  className={`result-amount__value${
                    isFree ? " result-amount__value--free" : ""
                  }`}
                >
                  {isFree ? "無料（0円）" : <CountUpAmount value={result.totalOwn} />}
                </p>
                {isFree && (
                  <p className="result-amount__note">
                    生活保護受給世帯は自己負担なしです
                  </p>
                )}
              </div>

              <div className="result-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">
                    正規料金（{result.days}日）
                  </span>
                  <span className="breakdown-value">
                    ¥{result.totalFull.toLocaleString()}
                  </span>
                </div>
                <div className="breakdown-item breakdown-item--subsidy">
                  <span className="breakdown-label">公費助成額</span>
                  <span className="breakdown-value">
                    －¥{result.totalSubsidy.toLocaleString()}
                  </span>
                </div>
                <div className="breakdown-item breakdown-item--total">
                  <span className="breakdown-label">自己負担合計</span>
                  <span className="breakdown-value">
                    ¥{result.totalOwn.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="result-meta">
                <span className="result-meta__item">
                  📅 利用期限：{result.data.deadline}
                </span>
                <span className="result-meta__item">
                  📋 助成上限：{result.data.maxDays}日
                </span>
              </div>

              {result.overMax && (
                <p className="result-warning">
                  ⚠️ {result.prefecture}の助成上限は{" "}
                  <strong>{result.data.maxDays}日</strong> です。{result.days}
                  日のうち{result.days - result.data.maxDays}
                  日分は自費となる可能性があります。
                </p>
              )}
              {result.ageWarning && (
                <p className="result-warning">
                  ⚠️ 赤ちゃんが{result.babyAge}
                  ヶ月の場合、助成期限（{result.data.deadline}
                  ）に注意が必要です。早めにご確認ください。
                </p>
              )}

              <div className="result-steps">
                <h5 className="result-steps__title">申請ステップ</h5>
                <ol className="step-list">
                  {applicationSteps.map((step, i) => (
                    <li className="step-item" key={i}>
                      <span className="step-item__num">{i + 1}</span>
                      <span className="step-item__text">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {result.data.applicationUrl && (
                <a
                  className="result-link"
                  href={result.data.applicationUrl}
                  target="_blank"
                  rel="noopener"
                >
                  オンライン申請はこちら →
                </a>
              )}
              {result.data.note && (
                <p className="result-note">{result.data.note}</p>
              )}

              <div className="result-card__footer">
                <Link href="/#facility" className="btn btn--primary">
                  施設を探す
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
