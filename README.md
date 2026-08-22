# Salon Orgaenics - Frontend Web Application (so-frontend)

Decoupled web user interface for Salon Orgaenics, deployed to AWS S3 & CDN via CloudFront.

## Structure
- `src/`: Client Application source files.
- `public/`: Static assets.
- `.github/workflows/deploy-frontend.yml`: CI/CD workflow to build assets, sync to S3, and invalidate CloudFront CDN cache.

## Getting Started
```bash
npm install
npm run dev
```
