"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

const CARE_TYPE_LABEL: Record<Facility["careType"], string> = {
  宿泊型: "宿泊型（ショートステイ）",
  通所型: "通所型（デイケア）",
  訪問型: "訪問型（アウトリーチ）",
};

const FEATURE_LABEL: Record<(typeof FEATURE_OPTIONS)[number], string> = {
  母乳ケア: "母乳ケア・授乳相談",
  メンタルケア: "メンタルケア",
  多胎児対応: "多胎児（双子など）対応",
  上の子同伴可: "上の子同伴可",
  公費助成対象: "公費助成対象",
};

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="rating-stars" aria-label={`評価 ${rating.toFixed(1)}、5点満点`}>
      <span aria-hidden="true">
        {[1, 2, 3, 4, 5].map((number) => (
          <span
            key={number}
            className={`rating-stars__star${number > rounded ? " empty" : ""}`}
          >
            ★
          </span>
        ))}
      </span>
      <span className="rating-stars__score">{rating.toFixed(1)}</span>
    </div>
  );
}

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export default function FacilitySearch({ facilities }: { facilities: Facility[] }) {
  const [area, setArea] = useState("");
  const [types, setTypes] = useState<Facility["careType"][]>([]);
  const [features, setFeatures] = useState<(typeof FEATURE_OPTIONS)[number][]>([]);
  const [sort, setSort] = useState<SortMode>("recommend");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!isDrawerOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDrawerOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isDrawerOpen]);

  const sorted = useMemo(() => {
    const list = facilities.filter((facility) => {
      if (area && facility.area !== area) return false;
      if (types.length && !types.includes(facility.careType)) return false;
      return features.every((feature) => facility.features.includes(feature));
    });

    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [facilities, area, types, features, sort]);

  const clearFilters = () => {
    setArea("");
    setTypes([]);
    setFeatures([]);
  };

  const removeChip = (kind: "area" | "type" | "feature", value: string) => {
    if (kind === "area") setArea("");
    if (kind === "type") {
      setTypes((current) => current.filter((item) => item !== value));
    }
    if (kind === "feature") {
      setFeatures((current) => current.filter((item) => item !== value));
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeChips = [
    ...(area ? [{ kind: "area" as const, value: area }] : []),
    ...types.map((value) => ({ kind: "type" as const, value })),
    ...features.map((value) => ({ kind: "feature" as const, value })),
  ];

  return (
    <div className="search-page">
      <aside
        id="search-filter-sidebar"
        className={`search-sidebar${isDrawerOpen ? " is-open" : ""}`}
        aria-label="施設検索の絞り込み"
        aria-hidden={!isDrawerOpen ? undefined : false}
      >
        <button
          type="button"
          className="search-drawer-close"
          aria-label="絞り込みを閉じる"
          onClick={() => setIsDrawerOpen(false)}
        >
          ✕
        </button>

        <div className="search-filter-panel">
          <h2 className="search-filter-panel__title">条件をしぼって探す</h2>

          <div className="filter-group search-filter-group">
            <label className="filter-label" htmlFor="search-area">
              エリア
            </label>
            <select
              id="search-area"
              className="filter-select"
              value={area}
              onChange={(event) => setArea(event.target.value)}
            >
              <option value="">すべてのエリア</option>
              {AREAS.map((item) => (
                <option key={item} value={item}>
                  {item === "横浜市" || item === "川崎市" ? "神奈川県" : "東京都"} {item}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="search-filter-group">
            <legend className="filter-label">ケア種別</legend>
            <div className="search-check-list">
              {CARE_TYPE_OPTIONS.map((type) => (
                <label className="search-check-item search-check-item--type" key={type}>
                  <input
                    type="checkbox"
                    checked={types.includes(type)}
                    onChange={() => setTypes((current) => toggleValue(current, type))}
                  />
                  <span className="search-check-item__box" aria-hidden="true" />
                  <span className="search-check-item__label">{CARE_TYPE_LABEL[type]}</span>
                  <span className={`search-check-item__dot search-check-item__dot--${type}`} aria-hidden="true" />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="search-filter-group">
            <legend className="filter-label">こだわり条件</legend>
            <div className="search-check-list">
              {FEATURE_OPTIONS.map((feature) => (
                <label className="search-check-item" key={feature}>
                  <input
                    type="checkbox"
                    checked={features.includes(feature)}
                    onChange={() => setFeatures((current) => toggleValue(current, feature))}
                  />
                  <span className="search-check-item__box" aria-hidden="true" />
                  <span className="search-check-item__label">{FEATURE_LABEL[feature]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="search-filter-actions">
            <button
              type="button"
              className="btn btn--primary btn--full search-filter-apply"
              onClick={() => setIsDrawerOpen(false)}
            >
              この条件で検索する
            </button>
            <button
              type="button"
              className="btn btn--outline btn--full search-filter-clear"
              onClick={clearFilters}
              disabled={activeChips.length === 0}
            >
              条件をクリア
            </button>
          </div>
        </div>
      </aside>

      <button
        type="button"
        className={`search-overlay${isDrawerOpen ? " is-visible" : ""}`}
        aria-label="絞り込みを閉じる"
        tabIndex={isDrawerOpen ? 0 : -1}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="search-main">
        <header className="search-hero">
          <div>
            <h1>産後ケア施設を探す</h1>
            <p>宿泊型・通所型・訪問型から、あなたに合ったケアが見つかります。</p>
          </div>
          <Link className="search-hero__cta" href="/#subsidy">
            💰 公費助成シミュレーターで自己負担額をチェック <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className="search-results-header">
          <p className="facility-count" aria-live="polite">
            検索結果<strong>{sorted.length}</strong>件
          </p>
          <div className="search-sort">
            <label htmlFor="facility-sort">並び替え</label>
            <select
              id="facility-sort"
              className="filter-select"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
            >
              <option value="recommend">おすすめ順</option>
              <option value="rating">評価が高い順</option>
              <option value="price-asc">料金が安い順</option>
              <option value="price-desc">料金が高い順</option>
            </select>
          </div>
        </div>

        <div className="search-active-chips" aria-live="polite" aria-label="選択中の絞り込み条件">
          {activeChips.map((chip) => (
            <span className="search-chip" key={`${chip.kind}-${chip.value}`}>
              {chip.value}
              <button
                type="button"
                aria-label={`${chip.value}の条件を外す`}
                onClick={() => removeChip(chip.kind, chip.value)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="facility-empty" role="status">
            <span aria-hidden="true">🔍</span>
            <p>条件に合う施設が見つかりませんでした。<br />条件を変更して、もう一度お試しください。</p>
          </div>
        ) : (
          <section className="facility-grid" aria-label="施設一覧">
            {sorted.map((facility) => {
              const isFavorite = favorites.has(facility.id);
              return (
                <article className="facility-card" key={facility.id}>
                  <div className={`facility-card__img search-photo--${facility.photoVariant}`}>
                    <span aria-hidden="true">{facility.icon}</span>
                    <span className={`availability-badge availability-badge--${facility.availability === "ok" ? "green" : "yellow"}`}>
                      {AVAILABILITY_LABEL[facility.availability]}
                    </span>
                    <button
                      type="button"
                      className={`search-favorite${isFavorite ? " is-favorite" : ""}`}
                      aria-label={isFavorite ? `${facility.name}をお気に入りから外す` : `${facility.name}をお気に入りに追加`}
                      aria-pressed={isFavorite}
                      onClick={() => toggleFavorite(facility.id)}
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>
                  </div>
                  <div className="facility-card__body">
                    <span className={`facility-card__type search-care-type--${facility.careType}`}>{facility.careType}</span>
                    <h2 className="facility-card__name">{facility.name}</h2>
                    <p className="facility-card__location">📍 {facility.addressDetail}</p>
                    <div className="facility-card__rating">
                      <StarRating rating={facility.rating} />
                      <span className="rating-stars__count">（{facility.reviewCount}件）</span>
                    </div>
                    <div className="tags">
                      {facility.features.map((feature) => (
                        <span className="tag" key={feature}>{feature}</span>
                      ))}
                    </div>
                    <div className="facility-card__footer">
                      <p className="facility-card__price">
                        <small>{facility.priceUnit}</small>{" "}
                        <strong>¥{facility.price.toLocaleString()}</strong>
                        <small>〜{facility.subsidyApplicable ? "（助成適用時）" : ""}</small>
                      </p>
                      <Link href={`/facility/${facility.id}`} className="btn btn--primary btn--sm facility-card__detail-btn">
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      <button
        type="button"
        className="search-drawer-toggle"
        aria-controls="search-filter-sidebar"
        aria-expanded={isDrawerOpen}
        onClick={() => setIsDrawerOpen(true)}
      >
        🔍 条件をしぼる
      </button>
    </div>
  );
}
