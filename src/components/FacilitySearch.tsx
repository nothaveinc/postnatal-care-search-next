"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AREAS,
  CARE_TYPE_OPTIONS,
  FEATURE_OPTIONS,
  type Facility,
} from "@/data/facilities";

type SortMode = "recommend" | "rating" | "price-asc" | "price-desc";

const AVAILABILITY_LABEL: Record<Facility["availability"], string> = {
  ok: "空きあり",
  few: "残りわずか",
};

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`rating-stars__star${n > rounded ? " empty" : ""}`}
        >
          ★
        </span>
      ))}
      <span className="rating-stars__score">{rating.toFixed(1)}</span>
    </div>
  );
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export default function FacilitySearch({
  facilities,
}: {
  facilities: Facility[];
}) {
  const [area, setArea] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [sort, setSort] = useState<SortMode>("recommend");

  const filtered = useMemo(() => {
    return facilities.filter((f) => {
      if (area && f.area !== area) return false;
      if (types.length && !types.includes(f.careType)) return false;
      if (
        features.length &&
        !features.every((feat) => f.features.includes(feat))
      )
        return false;
      return true;
    });
  }, [facilities, area, types, features]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filtered, sort]);

  const hasActiveFilter = area !== "" || types.length > 0 || features.length > 0;

  return (
    <div>
      <div className="facility-filter">
        <span className="facility-filter__label">エリア</span>
        <select
          className="filter-select"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          aria-label="エリアで絞り込む"
        >
          <option value="">すべてのエリア</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <span className="facility-filter__label">ケア種別</span>
        {CARE_TYPE_OPTIONS.map((t) => (
          <button
            key={t}
            type="button"
            className={`filter-btn${types.includes(t) ? " is-active" : ""}`}
            aria-pressed={types.includes(t)}
            onClick={() => setTypes((prev) => toggleValue(prev, t))}
          >
            {t}
          </button>
        ))}

        <span className="facility-filter__label">こだわり条件</span>
        {FEATURE_OPTIONS.map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-btn${features.includes(f) ? " is-active" : ""}`}
            aria-pressed={features.includes(f)}
            onClick={() => setFeatures((prev) => toggleValue(prev, f))}
          >
            {f}
          </button>
        ))}

        {hasActiveFilter && (
          <button
            type="button"
            className="btn btn--text"
            onClick={() => {
              setArea("");
              setTypes([]);
              setFeatures([]);
            }}
          >
            条件をクリア
          </button>
        )}
      </div>

      <div className="facility-search__header">
        <p className="facility-count" aria-live="polite">
          検索結果 <strong>{sorted.length}</strong> 件
        </p>
        <div className="filter-group facility-search__sort">
          <label className="filter-label" htmlFor="facility-sort">
            並び替え
          </label>
          <select
            id="facility-sort"
            className="filter-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
          >
            <option value="recommend">おすすめ順</option>
            <option value="rating">評価が高い順</option>
            <option value="price-asc">料金が安い順</option>
            <option value="price-desc">料金が高い順</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="facility-empty">
          条件に合う施設が見つかりませんでした。条件を変更して、もう一度お試しください。
        </div>
      ) : (
        <div className="facility-grid">
          {sorted.map((f) => (
            <article className="facility-card" key={f.id}>
              <div className="facility-card__img">
                <span>{f.icon}</span>
                <span
                  className={`availability-badge availability-badge--${
                    f.availability === "ok" ? "green" : "yellow"
                  }`}
                >
                  {AVAILABILITY_LABEL[f.availability]}
                </span>
              </div>
              <div className="facility-card__body">
                <div className="facility-card__head">
                  <h3 className="facility-card__name">{f.name}</h3>
                </div>
                <div className="facility-card__meta">
                  <span className="facility-card__type">{f.careType}</span>
                  <span className="facility-card__location">
                    📍 {f.prefecture}
                    {f.addressDetail}
                  </span>
                </div>
                <div className="facility-card__rating">
                  <StarRating rating={f.rating} />
                  <span className="rating-stars__count">
                    （{f.reviewCount}件）
                  </span>
                </div>
                <div className="tags">
                  {f.features.map((feat) => (
                    <span
                      key={feat}
                      className={`tag ${
                        feat === "公費助成対象" ? "tag--secondary" : "tag--primary"
                      }`}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="facility-card__footer">
                <p className="facility-card__price">
                  <small>{f.priceUnit}</small> <strong>¥{f.price.toLocaleString()}</strong>
                  {f.subsidyApplicable && <small>〜（助成適用時）</small>}
                </p>
                <Link
                  href={`/facility/${f.id}`}
                  className="btn btn--primary btn--sm facility-card__detail-btn"
                >
                  詳細を見る
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
