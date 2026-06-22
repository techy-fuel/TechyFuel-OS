-- TechyFuel OS — Sample Seed Data
-- Matches the UI mock data so the app looks populated on first load

-- Team Members
insert into public.team_members (id, name, email, role, department, status) values
  ('11111111-1111-1111-1111-111111111111', 'Sara Khan',     'sara@brightpixel.co',    'owner',  'Leadership', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'Ali Raza',      'ali@brightpixel.co',     'admin',  'Design',     'active'),
  ('33333333-3333-3333-3333-333333333333', 'Zara Ahmed',    'zara@brightpixel.co',    'member', 'Marketing',  'active'),
  ('44444444-4444-4444-4444-444444444444', 'Omar Sheikh',   'omar@brightpixel.co',    'member', 'Development','active'),
  ('55555555-5555-5555-5555-555555555555', 'Hina Malik',    'hina@brightpixel.co',    'member', 'Content',    'active');

-- Clients
insert into public.clients (id, name, company, email, status, industry, monthly_value) values
  ('aaaa0001-0000-0000-0000-000000000001', 'Nova Tech',      'Nova Technology Ltd',  'contact@novatech.io',    'active', 'SaaS',       4500),
  ('aaaa0002-0000-0000-0000-000000000002', 'Bloom Foods',    'Bloom Foods Co',       'hi@bloomfoods.com',      'active', 'F&B',        2800),
  ('aaaa0003-0000-0000-0000-000000000003', 'Apex Realty',    'Apex Realty Group',    'info@apexrealty.com',    'active', 'Real Estate', 3200),
  ('aaaa0004-0000-0000-0000-000000000004', 'Spark Academy',  'Spark Online Academy', 'hello@sparkacademy.co',  'active', 'EdTech',     1900),
  ('aaaa0005-0000-0000-0000-000000000005', 'Swift Logistics','Swift Logistics LLC',  'ops@swiftlogistics.com', 'lead',   'Logistics',     0);

-- Projects
insert into public.projects (id, client_id, name, status, priority, due_date, budget, spent, progress) values
  ('bbbb0001-0000-0000-0000-000000000001', 'aaaa0001-0000-0000-0000-000000000001', 'Nova Launch Campaign',   'active',    'high',   '2025-07-15', 8000,  5200, 65),
  ('bbbb0002-0000-0000-0000-000000000002', 'aaaa0002-0000-0000-0000-000000000002', 'Bloom Social Relaunch',  'active',    'medium', '2025-07-30', 3500,  1200, 34),
  ('bbbb0003-0000-0000-0000-000000000003', 'aaaa0003-0000-0000-0000-000000000003', 'Apex Lead Gen Ads',      'active',    'high',   '2025-06-28', 5000,  4100, 82),
  ('bbbb0004-0000-0000-0000-000000000004', 'aaaa0004-0000-0000-0000-000000000004', 'Spark Content Strategy', 'paused',    'low',    '2025-08-10', 2000,   400, 20),
  ('bbbb0005-0000-0000-0000-000000000005', 'aaaa0001-0000-0000-0000-000000000001', 'Nova Website Revamp',    'active',    'medium', '2025-08-01', 6000,  1000, 17);

-- Tasks
insert into public.tasks (project_id, client_id, title, status, priority, assigned_to, due_date) values
  ('bbbb0001-0000-0000-0000-000000000001', 'aaaa0001-0000-0000-0000-000000000001', 'Finalise ad creatives',      'in_progress', 'high',   '33333333-3333-3333-3333-333333333333', '2025-06-25'),
  ('bbbb0001-0000-0000-0000-000000000001', 'aaaa0001-0000-0000-0000-000000000001', 'Client approval — round 2',  'review',      'high',   '22222222-2222-2222-2222-222222222222', '2025-06-24'),
  ('bbbb0002-0000-0000-0000-000000000002', 'aaaa0002-0000-0000-0000-000000000002', 'Write 30 captions',           'todo',        'medium', '33333333-3333-3333-3333-333333333333', '2025-07-01'),
  ('bbbb0003-0000-0000-0000-000000000003', 'aaaa0003-0000-0000-0000-000000000003', 'Launch Meta campaign',        'done',        'high',   '44444444-4444-4444-4444-444444444444', '2025-06-20'),
  ('bbbb0005-0000-0000-0000-000000000005', 'aaaa0001-0000-0000-0000-000000000001', 'Wireframes for homepage',     'in_progress', 'medium', '22222222-2222-2222-2222-222222222222', '2025-06-30'),
  ('bbbb0005-0000-0000-0000-000000000005', 'aaaa0001-0000-0000-0000-000000000001', 'Set up CMS',                  'todo',        'low',    '44444444-4444-4444-4444-444444444444', '2025-07-10');

-- Pipeline Deals
insert into public.pipeline_deals (client_id, title, value, stage, probability, expected_close, assigned_to) values
  ('aaaa0005-0000-0000-0000-000000000005', 'Swift — Full Marketing Retainer', 4800, 'proposal',     60, '2025-07-05', '11111111-1111-1111-1111-111111111111'),
  ('aaaa0004-0000-0000-0000-000000000004', 'Spark — Ads Management Upsell',   1200, 'qualified',    40, '2025-07-15', '11111111-1111-1111-1111-111111111111'),
  ('aaaa0003-0000-0000-0000-000000000003', 'Apex — Q3 Campaign Expansion',    3500, 'negotiation',  80, '2025-06-30', '11111111-1111-1111-1111-111111111111');

-- Content Posts
insert into public.content_posts (client_id, title, caption, platform, status, scheduled_at, assigned_to) values
  ('aaaa0002-0000-0000-0000-000000000002', 'Summer Menu Drop',    'Fresh flavours, bold ideas 🌿 #BloomFoods', 'instagram', 'scheduled', '2025-06-25 10:00:00+00', '55555555-5555-5555-5555-555555555555'),
  ('aaaa0001-0000-0000-0000-000000000001', 'Product Launch Reel', 'The future is here. Nova 3.0 is live.',      'instagram', 'draft',     null,                      '33333333-3333-3333-3333-333333333333'),
  ('aaaa0003-0000-0000-0000-000000000003', 'Client Testimonial',  '"Apex doubled our leads in 60 days."',       'linkedin',  'scheduled', '2025-06-26 09:00:00+00', '55555555-5555-5555-5555-555555555555');

-- Ad Campaigns
insert into public.ad_campaigns (client_id, name, platform, status, budget_daily, spent, impressions, clicks, conversions) values
  ('aaaa0001-0000-0000-0000-000000000001', 'Nova — Lead Gen Q2',       'meta', 'active', 150, 2840, 184200, 3210, 142),
  ('aaaa0003-0000-0000-0000-000000000003', 'Apex — Property Listings', 'meta', 'active', 200, 4100,  98500, 1870,  89),
  ('aaaa0002-0000-0000-0000-000000000002', 'Bloom — Brand Awareness',  'meta', 'paused',  50,  400,  22000,  310,   8);

-- Invoices
insert into public.invoices (client_id, project_id, invoice_no, status, amount, tax, due_date) values
  ('aaaa0001-0000-0000-0000-000000000001', 'bbbb0001-0000-0000-0000-000000000001', 'INV-2025-001', 'paid',    4500, 675, '2025-06-01'),
  ('aaaa0002-0000-0000-0000-000000000002', 'bbbb0002-0000-0000-0000-000000000002', 'INV-2025-002', 'sent',    2800, 420, '2025-06-30'),
  ('aaaa0003-0000-0000-0000-000000000003', 'bbbb0003-0000-0000-0000-000000000003', 'INV-2025-003', 'overdue', 3200, 480, '2025-06-15'),
  ('aaaa0004-0000-0000-0000-000000000004', 'bbbb0004-0000-0000-0000-000000000004', 'INV-2025-004', 'draft',   1900, 285, '2025-07-15');
