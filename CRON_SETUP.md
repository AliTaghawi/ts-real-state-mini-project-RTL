# راهنمای تنظیم Cron Job برای پاکسازی خودکار فایل‌ها

این راهنما برای تنظیم پاکسازی خودکار فایل‌های استفاده نشده هر شب ساعت 3 صبح است.

## اگر از Vercel استفاده می‌کنید

فایل `vercel.json` در پروژه وجود دارد و به صورت خودکار تنظیم می‌شود. فقط باید مطمئن شوید که:
1. پروژه روی Vercel deploy شده باشد
2. Vercel Cron Jobs فعال باشد (در پلن Pro یا بالاتر)

## اگر از سرویس دیگری استفاده می‌کنید

### گزینه 1: استفاده از Cron Service (مثل cron-job.org)

1. به [cron-job.org](https://cron-job.org) بروید و یک حساب کاربری بسازید
2. یک cron job جدید ایجاد کنید:
   - **URL**: `https://your-domain.com/api/cron/cleanup-unused-files`
   - **Schedule**: `0 3 * * *` (هر شب ساعت 3 صبح)
   - **Method**: GET
   - **Headers**: 
     ```
     Authorization: Bearer YOUR_CRON_SECRET
     ```
3. در فایل `.env` یا `.env.local` متغیر `CRON_SECRET` را تنظیم کنید:
   ```
   CRON_SECRET=your-secret-key-here
   ```

### گزینه 2: استفاده از EasyCron

1. به [EasyCron](https://www.easycron.com) بروید
2. یک cron job جدید ایجاد کنید با همان تنظیمات بالا

### گزینه 3: استفاده از GitHub Actions (اگر روی GitHub deploy شده)

یک فایل `.github/workflows/cleanup.yml` ایجاد کنید:

```yaml
name: Cleanup Unused Files

on:
  schedule:
    - cron: '0 3 * * *'  # هر شب ساعت 3 صبح
  workflow_dispatch:  # امکان اجرای دستی

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cleanup
        run: |
          curl -X GET "https://your-domain.com/api/cron/cleanup-unused-files" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## امنیت

برای امنیت بیشتر، حتماً متغیر `CRON_SECRET` را در environment variables تنظیم کنید و از آن در cron service استفاده کنید.

## تست

برای تست دستی، می‌توانید این URL را با یک GET request فراخوانی کنید:

```bash
curl -X GET "https://your-domain.com/api/cron/cleanup-unused-files" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

یا از پنل ادمین دکمه "پاکسازی فایل‌های استفاده نشده" را استفاده کنید.

