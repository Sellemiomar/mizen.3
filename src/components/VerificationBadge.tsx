import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, HelpCircle, ExternalLink } from 'lucide-react';
import { VerificationRecord, Language } from '../types/financing';
import { TRANSLATIONS } from '../i18n/translations';

interface VerificationBadgeProps {
  verification: VerificationRecord;
  language: Language;
  showSourceLink?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  verification,
  language,
  showSourceLink = true
}) => {
  const t = TRANSLATIONS[language];

  const getStatusConfig = () => {
    switch (verification.status) {
      case 'VERIFIED':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
          label: t.verifiedBadge,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
        };
      case 'PARTIALLY_VERIFIED':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
          label: t.partiallyVerifiedBadge,
          bg: 'bg-amber-50 text-amber-800 border-amber-200'
        };
      case 'OUTDATED':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0" />,
          label: t.outdatedBadge,
          bg: 'bg-orange-50 text-orange-800 border-orange-200'
        };
      case 'UNVERIFIED':
      case 'SOURCE_UNAVAILABLE':
      default:
        return {
          icon: <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
          label: t.unverifiedBadge,
          bg: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        id={`verification-badge-${verification.status.toLowerCase()}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.bg}`}
      >
        {config.icon}
        <span>{config.label}</span>
      </div>

      <span className="text-xs text-slate-700">
        {t.lastCheckedLabel} : {verification.dateChecked}
      </span>

      {showSourceLink && verification.sourceUrl && (
        <a
          href={verification.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 hover:underline font-medium"
          title={verification.sourceTitle}
        >
          <span>Source officielle</span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      )}
    </div>
  );
};
