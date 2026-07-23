import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubpageHero from "@/components/SubpageHero";
import { getFacilityById } from "@/data/facilities";

type Params = { id: string };

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

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const facility = getFacilityById(id);
  if (!facility) return {};

  return {
    title: facility.name,
    description: facility.description,
    alternates: { canonical: `/facility/${id}` },
  };
}

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const facility = getFacilityById(id);

  if (!facility) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: facility.name,
    description: facility.description,
    address: {
      "@type": "PostalAddress",
      addressRegion: facility.prefecture,
      addressLocality: facility.addressDetail,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: facility.rating,
      reviewCount: facility.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubpageHero title={facility.name} path={`/facility/${facility.id}`} />
      <div className="subpage-main">
        <div className="container">
          <div className="facility-detail__top">
            <div className="facility-detail__photo">
              <span>{facility.icon}</span>
              <span
                className={`facility-detail__badge availability-badge availability-badge--${
                  facility.availability === "ok" ? "green" : "yellow"
                }`}
              >
                {facility.availability === "ok" ? "空きあり" : "残りわずか"}
              </span>
            </div>

            <div className="facility-detail__body">
              <span className="facility-detail__type">{facility.careType}</span>
              <p className="facility-detail__location">
                📍 {facility.prefecture}
                {facility.addressDetail}
              </p>
              <div className="facility-detail__rating">
                <StarRating rating={facility.rating} />
                <span className="rating-stars__count">
                  （{facility.reviewCount}件）
                </span>
              </div>
              <div className="tags">
                {facility.features.map((feat) => (
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
              <p className="facility-detail__price">
                <small>{facility.priceUnit}</small>{" "}
                <strong>¥{facility.price.toLocaleString()}</strong>
                {facility.subsidyApplicable && <small>〜（助成適用時）</small>}
              </p>
              <div className="facility-detail__actions">
                <Link href="/search" className="btn btn--outline">
                  施設を探す一覧に戻る
                </Link>
                <Link href="/contact" className="btn btn--primary">
                  お問い合わせ
                </Link>
              </div>
            </div>
          </div>

          <section className="facility-detail__section">
            <h2>施設について</h2>
            <p className="facility-detail__description">{facility.description}</p>
          </section>

          <section className="facility-detail__section">
            <h2>基本情報</h2>
            <div className="facility-detail__meta-list">
              <div className="facility-detail__meta-row">
                <span className="facility-detail__meta-label">アクセス</span>
                <span>{facility.access}</span>
              </div>
              <div className="facility-detail__meta-row">
                <span className="facility-detail__meta-label">営業時間</span>
                <span>{facility.hours}</span>
              </div>
            </div>
          </section>

          <section className="facility-detail__section">
            <h2>口コミ</h2>
            <div className="review-list">
              {facility.reviews.map((review, i) => (
                <div className="review-item" key={i}>
                  <div className="review-item__header">
                    <span className="review-item__avatar">👤</span>
                    <div className="review-item__meta">
                      <p className="review-item__name">{review.name}</p>
                      <p className="review-item__date">{review.date}</p>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="review-item__text">{review.text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="facility-detail__footer-cta">
            <Link href="/search" className="btn btn--outline">
              施設を探す一覧に戻る
            </Link>
            <Link href="/contact" className="btn btn--primary">
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
