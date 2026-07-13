"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type Errors = {
  name?: string;
  email?: string;
  message?: string;
  agree?: string;
};

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const next: Errors = {};
    if (!name.trim()) {
      next.name = "お名前を入力してください。";
    }
    if (!email.trim()) {
      next.email = "メールアドレスを入力してください。";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "正しいメールアドレスを入力してください。";
    }
    if (!message.trim()) {
      next.message = "メッセージを入力してください。";
    }
    if (!agree) {
      next.agree = "同意が必要です。";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    alert("お問い合わせを受け付けました。3営業日以内にご返信いたします。");
    setName("");
    setEmail("");
    setType("");
    setMessage("");
    setAgree(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="contactName">
          お名前 <span className="required">*必須</span>
        </label>
        <input
          type="text"
          id="contactName"
          className={`form-input${errors.name ? " form-input--error" : ""}`}
          placeholder="例: 山田 花子"
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
        />
        {errors.name && (
          <span className="form-error-text is-visible">{errors.name}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contactEmail">
          メールアドレス <span className="required">*必須</span>
        </label>
        <input
          type="email"
          id="contactEmail"
          className={`form-input${errors.email ? " form-input--error" : ""}`}
          placeholder="例: hanako@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
        />
        {errors.email && (
          <span className="form-error-text is-visible">{errors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contactType">
          お問い合わせ種別
        </label>
        <select
          id="contactType"
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">選択してください</option>
          <option value="facility">施設情報について</option>
          <option value="subsidy">公費助成について</option>
          <option value="feedback">サービスへのご意見</option>
          <option value="listing">施設掲載希望</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contactMessage">
          メッセージ <span className="required">*必須</span>
        </label>
        <textarea
          id="contactMessage"
          className={`form-textarea${errors.message ? " form-textarea--error" : ""}`}
          placeholder="お問い合わせ内容をご記入ください。"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setErrors((prev) => ({ ...prev, message: undefined }));
          }}
        />
        {errors.message && (
          <span className="form-error-text is-visible">{errors.message}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-checkbox-wrap">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              if (e.target.checked) {
                setErrors((prev) => ({ ...prev, agree: undefined }));
              }
            }}
          />
          <span>
            <Link href="/privacy" target="_blank" rel="noopener">
              プライバシーポリシー
            </Link>
            に同意します。
            <span className="required" style={{ fontSize: "0.75rem", marginLeft: 4 }}>
              *必須
            </span>
          </span>
        </label>
        {errors.agree && (
          <span className="form-error-text is-visible">{errors.agree}</span>
        )}
      </div>

      <div className="form-group form-group--submit" style={{ marginBottom: 0 }}>
        <button type="submit" className="btn btn--primary btn--full">
          送信する
        </button>
      </div>
    </form>
  );
}
