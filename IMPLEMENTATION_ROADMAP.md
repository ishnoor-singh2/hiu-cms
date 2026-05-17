# Implementation Roadmap

Complete roadmap for deploying the HIU CMS system.

## 📋 Project Overview

**Project:** Health Innovation University CMS  
**Scope (MVP):** News management system with bilingual support (German/English)  
**Platform:** Sanity headless CMS + Next.js frontend  
**Timeline:** 2-4 weeks for MVP deployment  

---

## 🚀 Quick Start (Next 24 Hours)

### Your Immediate Next Steps

1. **Create Sanity Account** (5 minutes)
   - Visit https://sanity.io
   - Sign up (free)
   - Create project named "HIU CMS"

2. **Get Project Credentials** (5 minutes)
   - Copy Project ID from Sanity dashboard
   - Generate API token
   - Save credentials

3. **Configure Local Environment** (5 minutes)
   - Edit `.env.local` in project directory
   - Add Project ID and API token
   - Save file

4. **Start CMS Studio** (5 minutes)
   ```bash
   cd /Users/ishnoorsingh/Code/HIU_dev/hiu-cms
   npm install
   npm run dev
   ```

5. **Access Admin Panel** (2 minutes)
   - Open http://localhost:3333
   - Log in with Sanity credentials
   - Explore the interface

**Time Investment:** ~30 minutes  
**Result:** CMS running locally, ready for content creation

---

## 📅 Phase-by-Phase Implementation

### Phase 1: Foundation (Week 1)
**Goal:** CMS infrastructure ready for content creation

#### Tasks

- [x] Design news schema based on existing data
- [x] Create Sanity project structure
- [x] Configure bilingual support (EN/DE)
- [x] Set up image management
- [ ] Create Sanity project account
- [ ] Deploy CMS to Sanity Cloud (optional)
- [ ] Configure team access
- [ ] Create sample article

**Deliverables:**
- ✅ Sanity project running locally
- ✅ News article schema ready
- ✅ Admin interface functional
- ✅ Team can access CMS

**Effort:** 2-3 developer hours + 1-2 content editor hours

---

### Phase 2: Content Migration (Week 1-2)
**Goal:** Existing news articles in the CMS

#### Tasks

- [ ] Export existing news articles from current site
- [ ] Create migration script (automated or manual)
- [ ] Import articles into Sanity
- [ ] Review and verify imported content
- [ ] Add missing images from cache
- [ ] Update slug references

**Sample Articles to Migrate:**
1. "Berlin's First District-Wide Health Day" (gesundheitstag-2026)
2. "New Name, New Campus – Ready for What's Next" (the-move)
3. "New Name, New Design..." (neuer-name-neues-design)
4. "Training Day 2026..." (tag-der-ausbildung-2026)
5. + 5 more existing articles

**Deliverables:**
- All past articles in CMS
- Images linked properly
- Slugs matching current URLs

**Effort:** 1-2 developer hours + 2-3 content editor hours

---

### Phase 3: Frontend Integration (Week 2-3)
**Goal:** Website displays news from CMS

#### Tasks

- [ ] Add Next.js Sanity client to frontend
- [ ] Create GROQ queries for news articles
- [ ] Update news page component
- [ ] Create dynamic article page (`[slug]`)
- [ ] Add image optimization
- [ ] Implement language switching
- [ ] Test all links and images
- [ ] Set up ISR caching strategy

**Components to Create:**
```
lib/sanity.client.ts          - Sanity connection
lib/sanity.image.ts           - Image URL builder
app/news/page.tsx             - News listing
app/news/[slug]/page.tsx      - Single article
components/NewsCard.tsx       - Article preview card
components/ArticleContent.tsx - Rich text renderer
```

**Deliverables:**
- News page displays CMS articles
- Single article pages work
- Images load correctly
- Language switching functional

**Effort:** 4-6 developer hours

---

### Phase 4: Testing & QA (Week 3)
**Goal:** Everything works reliably

#### Quality Checks

- [ ] CMS admin panel responsive and intuitive
- [ ] All fields save/load correctly
- [ ] Images upload and display
- [ ] Bilingual content works (EN/DE)
- [ ] Articles draft → published workflow works
- [ ] Published articles appear on website
- [ ] Draft articles hidden from website
- [ ] Old articles can be archived
- [ ] Search/filtering works
- [ ] SEO metadata appears in page source
- [ ] Mobile responsive
- [ ] Performance acceptable

#### Browser Testing
- [ ] Chrome
- [ ] Firefox  
- [ ] Safari
- [ ] Mobile Safari
- [ ] Chrome Mobile

**Deliverables:**
- Test report
- Bug fixes completed
- Performance optimized

**Effort:** 1-2 developer hours

---

### Phase 5: Deployment (Week 4)
**Goal:** CMS live in production

#### Pre-Launch Checklist

**Sanity Setup:**
- [ ] Production dataset created
- [ ] API tokens generated
- [ ] CDN enabled
- [ ] Backups configured
- [ ] Team members added

**Website Update:**
- [ ] Environment variables updated
- [ ] Next.js deployed
- [ ] SSL/HTTPS enabled
- [ ] Monitoring set up
- [ ] Error tracking active

**Content:**
- [ ] First article published
- [ ] Team trained
- [ ] Workflow documented
- [ ] Rollback plan ready

**Deliverables:**
- Live CMS at manage.sanity.io
- Live news page on website
- Team trained and ready
- Documentation complete

**Effort:** 2-3 developer hours + 4-5 editorial hours

---

## 🎯 Implementation Timeline

```
Week 1:
├─ Mon-Tue: Foundation & Sanity setup
├─ Wed:     Content migration starts
├─ Thu:     Content migration continues
└─ Fri:     Content migration complete

Week 2:
├─ Mon-Tue: Frontend integration (fetch, display)
├─ Wed:     Dynamic article pages
├─ Thu:     Image optimization & language switching
└─ Fri:     Testing begins

Week 3:
├─ Mon-Tue: QA testing & bug fixes
├─ Wed:     Performance optimization
├─ Thu:     Team training & documentation
└─ Fri:     Final review

Week 4:
├─ Mon:     Production deployment
├─ Tue:     Monitor & fix issues
├─ Wed-Fri: Stabilization & optimization
```

---

## 💰 Resource Breakdown

### Developer Hours (Estimate)
- Phase 1 (Setup): 2-3 hours
- Phase 2 (Migration): 1-2 hours
- Phase 3 (Integration): 4-6 hours
- Phase 4 (Testing): 1-2 hours
- Phase 5 (Deployment): 2-3 hours
- **Total: 10-16 hours** (~2-3 weeks part-time)

### Content Editor Hours
- Phase 1 (Learning): 1-2 hours
- Phase 2 (Migration): 2-3 hours
- Phase 4 (Testing): 1 hour
- Phase 5 (Training): 2-3 hours
- **Total: 6-9 hours** (~1-2 weeks)

### Infrastructure Costs (Annual)

| Item | Free Plan | Paid Plan | Cost |
|------|-----------|-----------|------|
| Sanity CMS | ✅ | - | $0/month* |
| API Requests | 100K/month | Unlimited | Included |
| Team Members | 3 | Unlimited | $29-99/month |
| Storage | 20GB | 200GB+ | Included |
| CDN/Bandwidth | ✅ | - | Included |
| **Total** | | | $0-99/month |

*Free tier sufficient for MVP. Upgrade to paid when traffic grows or team exceeds 3 members.

---

## 🔧 Technical Architecture

### Current Stack
```
Frontend:     Next.js 14+ / React
CMS:          Sanity (Headless)
Database:     Sanity managed
Storage:      Sanity CDN + Image API
Languages:    German (de) + English (en)
```

### Data Flow
```
1. Content Editor
   ↓
2. Sanity CMS Admin Panel
   ↓
3. Sanity Database & CDN
   ↓
4. Next.js (GROQ queries)
   ↓
5. Website Visitor
```

### API Queries
```groq
// Get all published articles
*[_type == "news" && status == "published"] 
| order(publishDate desc)

// Get single article by slug
*[_type == "news" && slug.current == $slug][0]

// Get articles by language
*[_type == "news"][]{
  title { en, de },
  summary { en, de }
}
```

---

## 📊 Success Metrics

### Phase 1 Success
- [ ] CMS admin accessible at localhost:3333
- [ ] Can create news article
- [ ] Both English and German fields work
- [ ] Can upload and preview images

### Phase 2 Success
- [ ] 10+ articles in database
- [ ] All articles have correct metadata
- [ ] Images load properly
- [ ] Slugs match current URLs

### Phase 3 Success
- [ ] News page loads articles from CMS
- [ ] Article pages display content
- [ ] Images render correctly
- [ ] Language switching works

### Phase 4 Success
- [ ] No console errors
- [ ] All pages load in <3 seconds
- [ ] Responsive on mobile
- [ ] SEO metadata present

### Phase 5 Success
- [ ] Live on production
- [ ] Team can publish articles
- [ ] Analytics tracking works
- [ ] No performance degradation

---

## 🚨 Risk Mitigation

### Risk: Data Loss
**Mitigation:**
- Export backups monthly
- Sanity managed backups included
- Version control for code

### Risk: Slow Performance
**Mitigation:**
- Image optimization (ISR)
- CDN caching enabled
- Monitor API usage

### Risk: Content Not Appearing
**Mitigation:**
- Verify article status is "published"
- Check slug matches route
- Use Vision tool to debug queries

### Risk: Team Needs Training
**Mitigation:**
- Comprehensive documentation
- Video tutorials (to create)
- In-person onboarding session

---

## 🎓 Team Training Plan

### For Content Editors
**Duration:** 2 hours  
**Topics:**
- CMS interface overview
- Creating news article (live demo)
- Image upload & alt text
- Draft vs. Published workflow
- Scheduling articles
- Q&A

### For Developers
**Duration:** 3 hours  
**Topics:**
- Sanity schema design
- GROQ query language
- Next.js integration
- Image optimization
- Troubleshooting
- Future expansion (Programs, Team, Events)

### For Managers
**Duration:** 1 hour  
**Topics:**
- Editorial workflow
- Team access management
- Monitoring/reporting
- Backup & maintenance

---

## 🔄 Ongoing Maintenance

### Weekly
- Monitor CMS performance
- Check for errors/issues
- Review published content

### Monthly
- Export data backup
- Review analytics
- Update documentation
- Team check-in

### Quarterly
- Plan next content type (Programs)
- Review SEO performance
- Upgrade dependencies
- Plan expansion features

---

## 🚀 Future Phases (Post-MVP)

### Phase 6: Programs/Courses (Q3 2026)
- Create Program content type
- Link programs to courses
- Add prerequisites
- Link instructors

### Phase 7: Team Profiles (Q4 2026)
- Faculty directory
- Team bios with images
- Expertise/specializations
- Research interests

### Phase 8: Events (Q1 2027)
- Event listings
- Registrations (optional)
- Calendar view
- Event notifications

### Phase 9: Advanced Features
- Comments/testimonials
- Advanced search
- Content scheduling
- Workflow approval system
- A/B testing variants

---

## ✅ Deliverables Summary

### By End of MVP

1. **CMS System**
   - Sanity project deployed
   - News schema configured
   - Bilingual support working
   - Admin interface ready

2. **Content**
   - 10+ articles migrated
   - Images optimized
   - Slugs mapped correctly
   - SEO metadata added

3. **Website Integration**
   - News page updated
   - Article pages dynamic
   - Language switching functional
   - Performance optimized

4. **Documentation**
   - Setup guide
   - Schema documentation
   - Integration guide
   - Team training materials

5. **Team Readiness**
   - 3-5 team members trained
   - Workflow documented
   - Support process established
   - Backup procedures ready

---

## 📞 Support & Handoff

### Support Channels
- **Technical Issues:** Sanity docs + GitHub issues
- **Integration Questions:** Next.js docs + integration guide
- **Content Questions:** Internal team wiki
- **Emergency:** Sanity support (premium)

### Knowledge Transfer
- Code documentation in comments
- Video walkthroughs (to record)
- Weekly team sync-ups
- Escalation process defined

---

## 🎉 Success Criteria

**MVP is successful when:**
1. ✅ Content editors can create/publish articles in CMS
2. ✅ Articles appear on website within 5 minutes
3. ✅ Bilingual content works seamlessly
4. ✅ No manual interventions needed
5. ✅ Team can operate CMS independently
6. ✅ Performance meets standards (<3s load time)
7. ✅ SEO properly configured
8. ✅ System stable for 2+ weeks without issues

---

**Next Step:** Start with the Quick Start section above! 🚀
