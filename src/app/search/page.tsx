import type { Metadata } from "next";
import SubpageHero from "@/components/SubpageHero";
import FacilitySearch from "@/components/FacilitySearch";
import { facilities } from "@/data/facilities";

export const metadata: Metadata = {
  title: "施設を探す",
  description:
    "宿泊型・通所型・訪問型から、あなたに合った産後ケア施設を探せます。エリアや条件で絞り込み、口コミや料金を比較できます。",
  alternates: { canonical: "/search" },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: facilities.map((f, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `https://sango-care-navi.jp/facility/${f.id}`,
    name: f.name,
  })),
};

export default function SearchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <SubpageHero title="産後ケア施設を探す" path="/search" />
      <div className="subpage-main">
        <div className="container">
          <FacilitySearch facilities={facilities} />
        </div>
      </div>
    </>
  );
}
