import { useState, useEffect, useCallback } from 'react';
import { db } from '../data/db';

const DEFAULT_CONSENT = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export function useCookieConsent() {
  const [consent, setConsentState] = useState(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConsent();
  }, []);

  const loadConsent = async () => {
    try {
      const stored = await db.cookie_consent.toCollection().last();
      if (stored) {
        setConsentState(stored);
        setIsBannerVisible(false);
        applyConsentSettings(stored);
      } else {
        setConsentState(DEFAULT_CONSENT);
        setIsBannerVisible(true);
      }
    } catch (e) {
      console.error('Failed to load cookie consent:', e);
      setConsentState(DEFAULT_CONSENT);
      setIsBannerVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsent = useCallback(async (newConsent) => {
    const record = {
      ...newConsent,
      consent_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db.cookie_consent.put(record);
    setConsentState(record);
    setIsBannerVisible(false);
    applyConsentSettings(newConsent);
  }, []);

  const acceptAll = useCallback(() => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    updateConsent(allAccepted);
  }, [updateConsent]);

  const rejectNonEssential = useCallback(() => {
    updateConsent(DEFAULT_CONSENT);
  }, [updateConsent]);

  const dismissBanner = useCallback(() => {
    setIsBannerVisible(false);
  }, []);

  const canUseAnalytics = useCallback(() => {
    return consent?.analytics === true;
  }, [consent]);

  const canUseFunctional = useCallback(() => {
    return consent?.functional === true;
  }, [consent]);

  return {
    consent,
    isBannerVisible,
    isLoading,
    updateConsent,
    acceptAll,
    rejectNonEssential,
    dismissBanner,
    canUseAnalytics,
    canUseFunctional,
    hasConsent: consent !== null,
  };
}

function applyConsentSettings(consent) {
  if (typeof window !== 'undefined' && window.firebase?.analytics) {
    if (!consent.analytics) {
      window.firebase.analytics().setAnalyticsCollectionEnabled(false);
    } else {
      window.firebase.analytics().setAnalyticsCollectionEnabled(true);
    }
  }
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent }));
}
