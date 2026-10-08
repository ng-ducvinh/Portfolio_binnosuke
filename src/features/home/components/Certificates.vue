<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import { certificates } from "../../../content/certificates";
import { locale } from "../../../i18n/store";
import Banner from "../../../components/Banner.vue";
import { t } from "../../../i18n/utils/translate";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { CertificateItem, CertificateCategory, CertificateCategoryId } from "../../../content/types";

const loadedCategories = ref<CertificateCategory[]>([]);

const categoryI18nKeys: Record<CertificateCategoryId, string> = {
  professional: "cert-professional",
  competitions: "cert-competitions",
  academic: "cert-academic",
};

const emit = defineEmits<{
  (e: "loaded"): void;
}>();

const loadCertificates = async () => {
  if (!locale.value) return;
  const func = certificates[locale.value as keyof typeof certificates];
  if (!func) return;
  const module = await func();
  loadedCategories.value = module.default;
  emit("loaded");
  // After DOM updates with new certificates, refresh ScrollTrigger
  // so the contact section 3D animation triggers at the correct scroll position
  await nextTick();
  ScrollTrigger.refresh();
};

watch(locale, loadCertificates);
onMounted(loadCertificates);

// Lightbox
const lightboxCert = ref<CertificateItem | null>(null);

const openLightbox = (cert: CertificateItem) => {
  lightboxCert.value = cert;
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightboxCert.value = null;
  document.body.style.overflow = "";
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && lightboxCert.value) {
    closeLightbox();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <div class="certificates">

    <!-- Main title -->
    <div class="grid">
      <div class="certificates-title">
        <Banner class="certificates-title-banner" :copy="t('my')" size="sm" animated />
        <h2 class="certificates-title-copy">{{ t("certificates") }}</h2>
      </div>
    </div>

    <!-- Subcategory sections -->
    <div
      v-for="category in loadedCategories"
      :key="category.id"
      class="certificates-section"
    >
      <div class="grid">
        <h3 class="certificates-section-title">
          {{ t(categoryI18nKeys[category.id]) }}
        </h3>
      </div>
      <div class="grid">
        <div class="certificates-cards">
          <div
            v-for="cert in category.items"
            :key="cert.title"
            class="certificate-card"
            @click="openLightbox(cert)"
          >
            <div class="certificate-card-top">
              <div class="certificate-card-image-wrapper">
                <div class="certificate-card-image-container">
                  <img :src="cert.image" :alt="cert.title" class="certificate-card-image" />
                </div>
              </div>
            </div>
            <div class="certificate-card-content">
              <h4 class="certificate-card-title">{{ cert.title }}</h4>
              <p v-if="cert.description" class="certificate-card-description">{{ cert.description }}</p>
            </div>
          </div>
          <!-- Empty state for each subcategory -->
          <div v-if="category.items.length === 0" class="certificates-empty">
            <p class="certificates-empty-text">{{ t("no-certificates-yet") }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="lightboxCert" class="lightbox-overlay" @click.self="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox" aria-label="Close">&times;</button>
          <div class="lightbox-content">
            <img :src="lightboxCert.image" :alt="lightboxCert.title" class="lightbox-image" />
            <p class="lightbox-title">{{ lightboxCert.title }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.certificates {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  gap: var(--space-xl);
  padding-left: var(--space-outer);
  padding-right: var(--space-outer);
  background-color: var(--color-beige-600);
  padding-top: 96px;
  padding-bottom: 96px;

  @include mixins.mq("md") {
    padding-top: 144px;
    padding-bottom: 144px;
    gap: var(--space-xxl);
  }

  @include mixins.mq("lg") {
    gap: var(--space-xxxl);
  }

  &-title {
    position: relative;
    padding-top: var(--space-md);
    grid-column: 1 / 13;

    @include mixins.mq("md") {
      grid-column: 1 / 10;
    }

    @include mixins.mq("lg") {
      grid-column: 3 / 8;
    }

    &-copy {
      font-weight: 900;
      letter-spacing: 0.02em;
      font-size: var(--font-size-title-md);

      @include mixins.mq("sm") {
        font-size: var(--font-size-title-lg);
      }

      @include mixins.mq("xl") {
        font-size: var(--font-size-title-xl);
      }
    }

    &-banner {
      position: absolute;
      top: 0;
      left: -8px;
      transform: translate(0, -20%) rotate(-4deg);

      @include mixins.mq("lg") {
        left: -16px;
        transform: translate(0, -20%) rotate(-6deg);
      }
    }
  }

  &-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-lg);

    &-title {
      grid-column: 1 / 13;
      font-weight: 700;
      letter-spacing: 0.02em;
      font-size: var(--font-size-title-xs);
      color: var(--color-text-400);
      border-bottom: 2px solid var(--color-text-300);
      padding-bottom: var(--space-xs);

      @include mixins.mq("sm") {
        font-size: var(--font-size-title-sm);
      }

      @include mixins.mq("lg") {
        grid-column: 3 / 11;
      }
    }
  }

  &-cards {
    max-width: 100%;
    flex: 1;
    grid-column: 1 / span 12;
    display: grid;
    gap: var(--space-md);
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

    @include mixins.mq("md") {
      grid-column: 1 / span 12;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }

    @include mixins.mq("lg") {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      grid-column: 3 / span 8;
    }

    @include mixins.mq("xl") {
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    }
  }

  &-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-xl) 0;

    &-text {
      font-size: var(--font-size-md);
      color: var(--color-text-300);
      font-weight: 500;
      font-style: italic;
    }
  }
}

.certificate-card {
  position: relative;
  border-radius: var(--radius-lg);
  z-index: var(--z-index-layout);
  transition: transform 0.2s ease-in-out;
  max-width: 280px;
  cursor: pointer;

  @include mixins.hover {
    &:hover {
      transform: scale(1.02);
    }
  }

  &-top {
    position: relative;
    width: 100%;
  }

  &-image {
    width: 100%;
    height: 100%;
    object-fit: cover;

    &-container {
      aspect-ratio: 4/3;
    }

    &-wrapper {
      border-radius: var(--radius-md);
      overflow: hidden;
      background-color: var(--color-beige-500);
    }
  }

  &-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: var(--space-xs);
  }

  &-title {
    font-size: var(--font-size-title-xs);
    font-weight: 700;
    color: var(--color-text-400);
  }

  &-description {
    font-size: var(--font-size-md);
    color: var(--color-text-300);
    font-weight: 500;
  }
}

// Lightbox
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.lightbox-close {
  position: absolute;
  top: 16px;
  right: 24px;
  background: none;
  border: none;
  color: #fff;
  font-size: 40px;
  cursor: pointer;
  line-height: 1;
  z-index: 10000;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.7;
  }
}

.lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.lightbox-title {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  max-width: 600px;
}

// Transitions
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
