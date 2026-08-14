'use client';

import React, { useState } from 'react';
import { useTheme } from '../../components/theme-provider';
import {
  Button, Input, Textarea, Label, Select, Checkbox, Radio, Switch,
  Badge, Avatar, Separator, Tooltip, Skeleton, Spinner, Progress,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Modal, DropdownMenu, DropdownMenuItem, Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Alert, EmptyState, ErrorState, LoadingState, useToast,
} from '../../components/ui';

export default function DesignSystemPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [progress, setProgress] = useState(65);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-12">
      <h2 style={{ color: 'var(--foreground)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary)' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-start' }}>
        {children}
      </div>
    </section>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--foreground)', padding: '2rem', direction: 'rtl', fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>
      {/* Page Header */}
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: 'var(--card)', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>🎨 صفقة — معرض نظام التصميم</h1>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Phase 5 · Tiers 1–5 · Cairo Font · RTL · Light & Dark Mode</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['light', 'dark', 'system'] as const).map((t) => (
              <Button
                key={t}
                variant={theme === t ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTheme(t)}
              >
                {t === 'light' ? '☀️ فاتح' : t === 'dark' ? '🌙 داكن' : '💻 تلقائي'}
              </Button>
            ))}
          </div>
        </div>

        {/* === TIER 1: Color Tokens === */}
        <Section title="Tier 1 — ألوان النظام (Color Tokens)">
          {[
            { label: 'primary', bg: 'var(--primary)', fg: 'var(--primary-foreground)' },
            { label: 'secondary', bg: 'var(--secondary)', fg: 'var(--secondary-foreground)' },
            { label: 'accent', bg: 'var(--accent)', fg: 'var(--accent-foreground)' },
            { label: 'muted', bg: 'var(--muted)', fg: 'var(--muted-foreground)' },
            { label: 'card', bg: 'var(--card)', fg: 'var(--card-foreground)' },
            { label: 'background', bg: 'var(--background)', fg: 'var(--foreground)' },
            { label: 'border', bg: 'var(--border)', fg: 'var(--foreground)' },
            { label: 'success', bg: 'var(--success-background)', fg: 'var(--success-foreground)' },
            { label: 'warning', bg: 'var(--warning-background)', fg: 'var(--warning-foreground)' },
            { label: 'destructive', bg: 'var(--destructive-background)', fg: 'var(--destructive-foreground)' },
            { label: 'info', bg: 'var(--info-background)', fg: 'var(--info-foreground)' },
          ].map(({ label, bg, fg }) => (
            <div key={label} style={{ padding: '0.75rem 1.25rem', borderRadius: '0.75rem', backgroundColor: bg, color: fg, border: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600, minWidth: '100px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              {label}
            </div>
          ))}
        </Section>

        {/* === TIER 3: Typography === */}
        <Section title="Tier 3 — الخطوط (Cairo Typography)">
          <div style={{ width: '100%' }}>
            {[
              { cls: 'heading-display', label: 'Display — صفقة أسهل سوق', size: '2.5rem' },
              { cls: 'heading-1', label: 'H1 — تصفح آلاف الإعلانات', size: '2rem' },
              { cls: 'heading-2', label: 'H2 — منتجات بأسعار مناسبة', size: '1.5rem' },
              { cls: 'heading-3', label: 'H3 — بيع واشتري بكل سهولة', size: '1.25rem' },
              { cls: 'body-large', label: 'Body Large — ابحث عن أفضل الصفقات في منصتك المفضلة', size: '1.125rem' },
              { cls: 'body-normal', label: 'Body — منصة صفقة للبيع والشراء في مصر والوطن العربي', size: '1rem' },
              { cls: 'body-small', label: 'Body Small — انشر إعلانك مجاناً واوصل لملايين المشترين', size: '0.875rem' },
              { cls: 'caption', label: 'Caption — نشر منذ ٣ ساعات • القاهرة', size: '0.75rem' },
            ].map(({ label, size }) => (
              <p key={size} style={{ fontSize: size, marginBottom: '0.5rem', color: 'var(--foreground)' }}>{label}</p>
            ))}
          </div>
        </Section>

        {/* === TIER 4: Button System === */}
        <Section title="Tier 4 — الأزرار (Button System)">
          <Button variant="primary">زر أساسي</Button>
          <Button variant="secondary">زر ثانوي</Button>
          <Button variant="outline">زر محدد</Button>
          <Button variant="ghost">زر شبح</Button>
          <Button variant="destructive">زر حذف</Button>
          <Button variant="link">زر رابط</Button>
          <Button variant="primary" size="sm">صغير</Button>
          <Button variant="primary" size="lg">كبير</Button>
          <Button variant="primary" isLoading>جاري التحميل</Button>
          <Button variant="primary" disabled>معطّل</Button>
        </Section>

        {/* === Badge === */}
        <Section title="Tier 4 — العلامات (Badges)">
          <Badge variant="primary">نشط</Badge>
          <Badge variant="secondary">ثانوي</Badge>
          <Badge variant="success">مكتمل</Badge>
          <Badge variant="warning">قيد المراجعة</Badge>
          <Badge variant="destructive">مرفوض</Badge>
          <Badge variant="info">معلومة</Badge>
          <Badge variant="outline">مخطط</Badge>
        </Section>

        {/* === Avatar === */}
        <Section title="Tier 4 — الصور الشخصية (Avatar)">
          <Avatar name="أحمد محمد" size="sm" />
          <Avatar name="سارة علي" size="md" statusDot="online" />
          <Avatar name="محمد حسن" size="lg" statusDot="busy" />
          <Avatar name="نورا إبراهيم" size="xl" statusDot="offline" />
        </Section>

        {/* === Form Primitives === */}
        <Section title="Tier 4 — النماذج (Form Primitives)">
          <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <Label required>البريد الإلكتروني</Label>
              <Input type="email" placeholder="example@safqa.com" />
            </div>
            <div>
              <Label>كلمة المرور (خطأ)</Label>
              <Input type="password" placeholder="••••••••" error />
            </div>
            <div>
              <Label>البريد الإلكتروني (نجاح)</Label>
              <Input type="email" placeholder="تم التحقق" success />
            </div>
            <div>
              <Label>التصنيف</Label>
              <Select>
                <option value="">اختر التصنيف</option>
                <option value="electronics">إلكترونيات</option>
                <option value="clothes">ملابس</option>
                <option value="furniture">أثاث</option>
              </Select>
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea placeholder="اكتب وصف المنتج هنا..." />
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Checkbox
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
                label="أوافق على الشروط"
              />
              <Radio name="gender" label="ذكر" value="male" />
              <Radio name="gender" label="أنثى" value="female" />
              <Switch checked={switchOn} onChange={setSwitchOn} label="الإشعارات" />
            </div>
          </div>
        </Section>

        {/* === Primitives === */}
        <Section title="Tier 4 — باقي العناصر الأساسية">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Tooltip content="هذا تلميح توضيحي">
            <Button variant="outline" size="sm">مرر عليّ</Button>
          </Tooltip>
          <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Skeleton style={{ height: '12px', borderRadius: '6px' }} />
            <Skeleton style={{ height: '12px', borderRadius: '6px', width: '75%' }} />
            <Skeleton style={{ height: '12px', borderRadius: '6px', width: '50%' }} />
          </div>
          <div style={{ width: '200px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>تقدم الرفع: {progress}%</p>
            <Progress value={progress} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Button size="sm" variant="outline" onClick={() => setProgress(Math.max(0, progress - 10))}>-</Button>
              <Button size="sm" variant="outline" onClick={() => setProgress(Math.min(100, progress + 10))}>+</Button>
            </div>
          </div>
        </Section>

        <Separator />

        {/* === TIER 5: Card === */}
        <Section title="Tier 5 — البطاقات (Card)">
          <Card style={{ width: '280px' }}>
            <CardHeader>
              <CardTitle>آيفون ١٥ برو ماكس</CardTitle>
              <CardDescription>إلكترونيات • القاهرة</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>حالة ممتازة، مع الكرتونة الأصلية وكل الملحقات. تم استخدامه ٣ أشهر فقط.</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.75rem' }}>35,000 جنيه</p>
            </CardContent>
            <CardFooter style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button variant="outline" size="sm">مراسلة</Button>
              <Button size="sm">تفاصيل</Button>
            </CardFooter>
          </Card>
        </Section>

        {/* === Tabs === */}
        <Section title="Tier 5 — التبويبات (Tabs)">
          <div style={{ width: '100%', maxWidth: '500px' }}><Tabs defaultValue="published">
            <TabsList>
              <TabsTrigger value="published">منشور</TabsTrigger>
              <TabsTrigger value="sold">مباع</TabsTrigger>
              <TabsTrigger value="archived">مؤرشف</TabsTrigger>
            </TabsList>
            <TabsContent value="published">
              <Alert variant="success" title="الإعلانات النشطة">لديك ٣ إعلانات منشورة حالياً تظهر للمستخدمين.</Alert>
            </TabsContent>
            <TabsContent value="sold">
              <Alert variant="info" title="الإعلانات المباعة">لديك ١٢ صفقة مكتملة. أحسنت!</Alert>
            </TabsContent>
            <TabsContent value="archived">
              <Alert variant="warning" title="الإعلانات المؤرشفة">لديك ٢ إعلان مؤرشف يمكنك استعادتهم.</Alert>
            </TabsContent>
          </Tabs></div>
        </Section>

        {/* === Accordion === */}
        <Section title="Tier 5 — القائمة المنسدلة (Accordion)">
          <div style={{ width: '100%', maxWidth: '500px' }}><Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger value="q1">كيف أنشر إعلاناً على صفقة؟</AccordionTrigger>
              <AccordionContent value="q1">سجل دخولك، اضغط على "نشر إعلان"، أضف الصور والوصف والسعر، ثم اضغط نشر. سيظهر إعلانك فورًا للمستخدمين.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger value="q2">ما هو الحد الأقصى للإعلانات اليومية؟</AccordionTrigger>
              <AccordionContent value="q2">يمكنك نشر حتى ٣ إعلانات يومياً. يتجدد هذا الحد في منتصف الليل تلقائياً.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger value="q3">هل الاشتراك في صفقة مجاني؟</AccordionTrigger>
              <AccordionContent value="q3">نعم، التسجيل ونشر الإعلانات مجاني تماماً لجميع المستخدمين.</AccordionContent>
            </AccordionItem>
          </Accordion></div>
        </Section>

        {/* === Alerts === */}
        <Section title="Tier 5 — التنبيهات (Alert)">
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Alert variant="success" title="تم نشر الإعلان بنجاح">سيظهر إعلانك للمستخدمين الآن.</Alert>
            <Alert variant="warning" title="تنبيه: حد الإعلانات اليومي">لقد وصلت إلى الحد الأقصى اليومي للإعلانات (٣ إعلانات). يتجدد الحد غداً.</Alert>
            <Alert variant="destructive" title="فشل تحميل الصورة">حجم الصورة يتجاوز الحد المسموح (١٠ ميجابايت). يرجى اختيار صورة أصغر.</Alert>
            <Alert variant="info" title="معلومة">يمكنك التواصل مع البائع مباشرة عبر ميزة المراسلة.</Alert>
          </div>
        </Section>

        {/* === Modal === */}
        <Section title="Tier 5 — النوافذ المنبثقة (Modal)">
          <Button onClick={() => setModalOpen(true)}>افتح النافذة</Button>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="الإبلاغ عن إعلان"
            description="اختر سبب الإبلاغ وسنراجع الإعلان في أقرب وقت"
            footer={
              <>
                <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
                <Button onClick={() => { setModalOpen(false); toast({ title: 'تم إرسال البلاغ', description: 'سيراجع فريقنا هذا الإعلان قريباً', type: 'success' }); }}>إرسال البلاغ</Button>
              </>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Label>سبب البلاغ</Label>
              <Select>
                <option value="">اختر السبب</option>
                <option value="fake">منتج مزيف</option>
                <option value="spam">إعلان مكرر</option>
                <option value="inappropriate">محتوى غير لائق</option>
                <option value="fraud">احتيال</option>
              </Select>
              <Label>تفاصيل إضافية (اختياري)</Label>
              <Textarea placeholder="أضف تفاصيل إضافية..." rows={3} />
            </div>
          </Modal>
        </Section>

        {/* === Toast === */}
        <Section title="Tier 5 — الإشعارات العائمة (Toast)">
          <Button variant="primary" onClick={() => toast({ title: 'تم حفظ التغييرات', description: 'تم تحديث ملفك الشخصي بنجاح', type: 'success' })}>نجاح ✅</Button>
          <Button variant="destructive" onClick={() => toast({ title: 'فشل الاتصال', description: 'يرجى التحقق من الإنترنت والمحاولة مرة أخرى', type: 'error' })}>خطأ ❌</Button>
          <Button variant="outline" onClick={() => toast({ title: 'تنبيه', description: 'وصلت لـ ٣ إعلانات اليوم — الحد اليومي', type: 'warning' })}>تحذير ⚠️</Button>
          <Button variant="secondary" onClick={() => toast({ title: 'رسالة جديدة', description: 'أرسل لك أحمد رسالة بخصوص الإعلان', type: 'info' })}>معلومة ℹ️</Button>
        </Section>

        {/* === Dropdown === */}
        <Section title="Tier 5 — القوائم المنسدلة (Dropdown)">
          <DropdownMenu trigger={<Button variant="outline">قائمة المستخدم ▾</Button>}>
            <DropdownMenuItem onClick={() => toast({ title: 'الملف الشخصي', type: 'info' })}>👤 ملفي الشخصي</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: 'إعلاناتي', type: 'info' })}>📋 إعلاناتي</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: 'الإعدادات', type: 'info' })}>⚙️ الإعدادات</DropdownMenuItem>
            <Separator style={{ margin: '0.25rem 0' }} />
            <DropdownMenuItem onClick={() => toast({ title: 'تم تسجيل الخروج', type: 'warning' })}>🚪 تسجيل الخروج</DropdownMenuItem>
          </DropdownMenu>
        </Section>

        {/* === State Components === */}
        <Section title="Tier 5 — حالات الواجهة (States)">
          <EmptyState
            icon="📭"
            title="لا توجد إعلانات بعد"
            description="ابدأ بنشر أول إعلان لك الآن ووصل لآلاف المشترين"
            actionLabel="نشر إعلان"
            onAction={() => toast({ title: 'جاري فتح نموذج الإعلان...', type: 'info' })}
            style={{ maxWidth: '360px' }}
          />
          <ErrorState
            title="تعذر تحميل الإعلانات"
            message="فشل الاتصال بالخادم. تأكد من اتصالك بالإنترنت."
            onRetry={() => toast({ title: 'جاري إعادة المحاولة...', type: 'info' })}
            style={{ maxWidth: '360px' }}
          />
        </Section>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--muted-foreground)', fontSize: '0.75rem', borderTop: '1px solid var(--border)', marginTop: '2rem' }}>
          صفقة Design System · Phase 5 · Tiers 1–5 · ✅ جاهز للإنتاج
        </div>
      </div>
    </div>
  );
}
