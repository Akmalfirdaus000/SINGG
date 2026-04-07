# 📊 Analisis Tabel Database untuk Flow Nagari

## 📋 Ringkasan
**Total Tabel Dibutuhkan: ~30-35 tabel**

---

## 1️⃣ CORE USER MANAGEMENT (3 tabel)
- [x] `users` - User account (sudah ada)
- [ ] `user_profiles` - Extended profile data (NIK, foto profil, bio, alamat)
- [ ] `user_preferences` - User settings (tema, bahasa, notifikasi preference, lokasi default)

---

## 2️⃣ AUTHENTICATION & SECURITY (2 tabel)
- [ ] `auth_sessions` - Active sessions/tokens
- [ ] `otp_codes` - OTP verification codes (WhatsApp, Email)

---

## 3️⃣ PENGADUAN/TICKETS SYSTEM (6 tabel)
- [ ] `tickets` - Main complaint table
  - id, user_id, title, description, location, category, status, priority, progress_percentage
  - created_at, updated_at, target_completion_date
  
- [ ] `ticket_media` - Photos/videos for tickets
  - id, ticket_id, media_url, media_type, uploaded_by, created_at

- [ ] `ticket_comments` - Comments on tickets
  - id, ticket_id, user_id, comment_text, is_admin_comment, created_at

- [ ] `ticket_status_history` - Timeline of status changes
  - id, ticket_id, status, changed_by, note, created_at

- [ ] `ticket_ratings` - Ratings after ticket completion
  - id, ticket_id, user_id, rating (1-5), review_text, created_at

- [ ] `ticket_supports` - Like/support per ticket
  - id, ticket_id, user_id, created_at

---

## 4️⃣ LAYANAN ADMINISTRASI (3 tabel)
- [ ] `admin_requests` - Administrative service requests
  - id, user_id, request_type, status, description, priority
  
- [ ] `admin_documents` - Generated documents
  - id, admin_request_id, document_name, document_url, status, created_at, completed_at

- [ ] `admin_status_history` - Status tracking untuk requests
  - id, admin_request_id, status, updated_by, note, created_at

---

## 5️⃣ POINTS & REWARD SYSTEM (4 tabel)
- [ ] `user_points` - Current points balance
  - id, user_id, total_points, updated_at

- [ ] `points_transactions` - Points transaction log
  - id, user_id, activity_type, points_amount, reference_id, created_at
  - (activity_type: create_ticket, upload_photo, comment, rate, fraud_report, etc)

- [ ] `reward_catalogs` - Available rewards
  - id, name, description, points_cost, stock, category, created_at

- [ ] `reward_redemptions` - Redemption history
  - id, user_id, reward_id, redeemed_at, status

---

## 6️⃣ BADGE & ACHIEVEMENTS (2 tabel)
- [ ] `badges` - Badge definitions
  - id, name, description, icon_url, criteria, category
  - (Contoh: Pengaduan Pertama, Warga Teladan, Fotografer, Kontributor Forum, dll)

- [ ] `user_badges` - User's earned badges (many-to-many)
  - id, user_id, badge_id, earned_at

---

## 7️⃣ MESSAGING SYSTEM (2 tabel)
- [ ] `message_threads` - Conversation/thread
  - id, title, created_at, updated_at

- [ ] `messages` - Individual messages
  - id, thread_id, sender_id, receiver_id, message_text, is_read, created_at

---

## 8️⃣ FORUM & COMMUNITY (5 tabel)
- [ ] `forum_posts` - Forum/discussion posts
  - id, user_id, title, content, category (Penting, Ide & Saran, Tanya Jawab), 
  - view_count, created_at, updated_at, is_pinned

- [ ] `forum_comments` - Comments on forum posts
  - id, forum_post_id, user_id, comment_text, likes_count, created_at

- [ ] `polls` - Polling/survey
  - id, title, description, creator_id, created_at, ends_at, status

- [ ] `poll_options` - Poll options/choices
  - id, poll_id, option_text, vote_count

- [ ] `poll_votes` - User's vote on poll
  - id, poll_id, user_id, poll_option_id, voted_at

---

## 9️⃣ EVENTS & ACTIVITIES (2 tabel)
- [ ] `events` - Village events
  - id, title, description, location, start_date, end_date, organizer_id, created_at

- [ ] `event_attendees` - Event attendance tracking
  - id, event_id, user_id, attendance_status, joined_at

---

## 🔟 GALLERY & MEDIA (1 tabel)
- [ ] `gallery_photos` - Community photo gallery
  - id, user_id, photo_url, caption, created_at, likes_count

---

## 🔢 CROWDFUNDING (2 tabel)
- [ ] `crowdfunding_projects` - Crowdfunding project
  - id, title, description, goal_amount, current_amount, creator_id, 
  - status (active, funded, failed), end_date, created_at

- [ ] `crowdfunding_contributions` - Contributions to projects
  - id, project_id, user_id, amount, contributed_at

---

## 🔔 NOTIFICATIONS (2 tabel)
- [ ] `notifications` - User notifications
  - id, user_id, title, message, type (ticket_update, message, leaderboard, etc), 
  - reference_id, is_read, created_at

- [ ] `notification_templates` - Template notifikasi
  - id, type, title_template, message_template, created_at

---

## 📰 NEWS & ANNOUNCEMENTS (1 tabel)
- [ ] `announcements` - News/announcements from admin
  - id, title, content, priority, created_by, published_at, expired_at

---

## 📊 ANALYTICS & LOGS (2 tabel - Optional)
- [ ] `activity_logs` - General activity logging
  - id, user_id, action, details, created_at

- [ ] `audit_logs` - Admin/system audit trail
  - id, actor_id, action, target_table, target_id, changes, created_at

---

## 🎯 ADMIN & CONFIGURATION (1 tabel - Optional)
- [ ] `system_settings` - Global system configuration
  - key, value, description

---

## 📊 SUMMARY TABLE

| Category | Count | Tables |
|----------|-------|--------|
| User Management | 3 | users, user_profiles, user_preferences |
| Authentication | 2 | auth_sessions, otp_codes |
| Pengaduan | 6 | tickets, ticket_media, ticket_comments, ticket_status_history, ticket_ratings, ticket_supports |
| Admin Services | 3 | admin_requests, admin_documents, admin_status_history |
| Points & Rewards | 4 | user_points, points_transactions, reward_catalogs, reward_redemptions |
| Badges | 2 | badges, user_badges |
| Messaging | 2 | message_threads, messages |
| Forum & Community | 5 | forum_posts, forum_comments, polls, poll_options, poll_votes |
| Events | 2 | events, event_attendees |
| Gallery | 1 | gallery_photos |
| Crowdfunding | 2 | crowdfunding_projects, crowdfunding_contributions |
| Notifications | 2 | notifications, notification_templates |
| Announcements | 1 | announcements |
| Analytics | 2 | activity_logs, audit_logs |
| Configuration | 1 | system_settings |
| **TOTAL** | **38** | **(tanpa yang opsional: ~32)** |

---

## ✅ TABEL YANG SUDAH ADA

Dari cek di database migration:
- ✅ `users` - User account dasar

## ⚠️ REKOMENDASI PRIORITAS

### Priority 1 (WAJIB - MVP)
1. user_profiles
2. user_preferences
3. tickets + ticket_media + ticket_comments
4. ticket_ratings + ticket_supports
5. user_points + points_transactions
6. badges + user_badges
7. notifications + announcements
8. admin_requests + admin_documents

### Priority 2 (PENTING - v1.1)
1. forum_posts + forum_comments
2. messages (messaging system)
3. polls + poll_options + poll_votes
4. events + event_attendees

### Priority 3 (NICE TO HAVE - v1.2)
1. gallery_photos
2. crowdfunding_projects + crowdfunding_contributions
3. activity_logs + audit_logs

---

## 🔗 RELATIONSHIPS (Entity Diagram)

```
┌─────────────────────────────────────────────────┐
│                  USERS                          │
│  (id, name, email, role, created_at)            │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
    TICKETS     POINTS    BADGES
    (pengaduan) (rewards)  (achievements)
    │
    ├─ TICKET_MEDIA
    ├─ TICKET_COMMENTS ◄──────── NOTIFICATIONS
    ├─ TICKET_RATINGS
    └─ TICKET_SUPPORTS
```

---

## 💡 CATATAN

1. **Relasi Many-to-Many:**
   - users ↔ badges (via user_badges)
   - users ↔ events (via event_attendees)
   - tickets ↔ supports (banyak user bisa support 1 ticket)

2. **Denormalisasi untuk Performance:**
   - Pre-aggregate points di user_points (totalnya)
   - Cache leaderboard monthly
   - Store progress_percentage di tickets (bukan calculated)

3. **Indexing Penting:**
   - users.id, tickets.user_id, tickets.status
   - notifications.user_id, notifications.is_read
   - forum_posts.created_at, messages.thread_id

4. **Soft Delete?**
   - Pertimbangkan untuk tickets, forum_posts (history/audit trail)
   
5. **Timestamps:**
   - Semua tabel punya created_at & updated_at
   - Beberapa punya deleted_at (soft delete)
