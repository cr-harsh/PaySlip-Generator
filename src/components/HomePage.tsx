import type { MouseEvent } from 'react';
import './HomePage.css';

interface HomePageProps {
  onGeneratePayslip: () => void;
}

const HOME_PAGE_MARKUP = String.raw`<div class="h">

<header class="nav"><div class="w">
<a class="lg" href="#top"><i><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h4.5a8 8 0 0 1 0 16H7z"></path></svg></i>Derive <small>Recruiting</small></a>
<nav class="nl" aria-label="Primary"><a href="#products">Products</a><a href="#clients">Clients</a><a href="#impact">Impact</a><a href="#payroll">Payroll</a><a href="#contact">Contact</a></nav>
<a class="b p" href="Main.dc.html" style="min-height:44px;padding:0 20px">Open dashboard</a>
</div></header>

<section class="hero" id="top"><div class="w">
<div>
<span class="eb">● Recruitment technology suite</span>
<h1>Premier partner in <em>mid to senior level</em> hiring</h1>
<p class="lead">Derive connects top-tier talent with leading startups and enterprises across Fin-tech, E-commerce, Real Estate and Technology, and now runs the payroll too.</p>
<div class="cta"><a class="b p" href="Main.dc.html">Open payslip dashboard →</a><a class="b" href="#products">Explore products</a></div>
<div class="st"><div><b>7+</b><span>Years experience</span></div><div><b>1000+</b><span>Successful placements</span></div><div><b>95%</b><span>Female workforce</span></div></div>
</div>
<div class="vis" aria-hidden="true">
<div class="mock">
<div class="mh">PAYSLIP · OCT 2026<span>Ready to prepare</span></div>
<div class="mr">Gross earnings<b>₹38,129.03</b></div>
<div class="mr">Employee PF<b>₹1,935.48</b></div>
<div class="mr">TDS and advance<b>₹3,500.00</b></div>
<div class="mn"><span>NET PAY</span><b>₹30,758.07</b></div>
</div>
<div class="fl" style="left:-6px;top:0"><i>✓</i>Prepared for distribution</div>
<div class="fl" style="right:-6px;bottom:0">20 of 31 paid days</div>
</div>
</div></section>

<section class="tr" id="clients"><div class="w">
<p>TRUSTED BY 50+ LEADING COMPANIES</p>
<div class="cl"><span>PhonePe</span><span>Rupeek</span><span>Licious</span><span>CBRE</span><span>HDFC</span><span>Knight Frank</span><span>IQVIA</span><span>Acko</span><span>ET Money</span><span>Embassy</span></div>
</div></section>

<section class="sec" id="products"><div class="w">
<div class="sh"><small>OUR PRODUCTS</small><h2>One suite for the whole hiring lifecycle</h2><p>Comprehensive recruitment technology, from the first application to the final payslip.</p></div>
<div class="pg">
<div class="pc"><span class="t">ATS</span><h3>Applicant Tracking</h3><p>Track every candidate and application across clients in one pipeline.</p></div>
<div class="pc"><span class="t">CRM</span><h3>Client Relationships</h3><p>Manage client accounts, requirements and hiring activity.</p></div>
<div class="pc"><span class="t">AI</span><h3>AI Interviews</h3><p>AI-powered interview platform for faster, fairer screening.</p></div>
<div class="pc"><span class="t">TM</span><h3>Task Manager</h3><p>Keep recruiters aligned with recruitment task management.</p></div>
<div class="pc hi"><span class="tag">New in this release</span><span class="t">₹</span><h3>Payroll and payslip generation</h3><p>Pick a candidate, enter attendance, see a live breakdown and prepare the payslip for distribution, all from one calculation.</p><a class="b p" href="Main.dc.html" style="align-self:flex-start;margin-top:6px">Try the payslip flow →</a></div>
</div>
</div></section>

<section class="sec im" id="impact"><div class="w">
<div class="sh"><small style="color:#A5B4FC">OUR IMPACT</small><h2>Trusted by thousands of professionals and companies</h2></div>
<div class="ig"><div><b>50+</b><span>Trusted clients</span></div><div><b>15+</b><span>Industry sectors</span></div><div><b>98%</b><span>Candidate satisfaction</span></div><div><b>15 days</b><span>Average time to placement</span></div></div>
</div></section>

<section class="sec" id="payroll"><div class="w sp">
<div>
<div class="sh" style="margin-bottom:24px"><small>PAYROLL</small><h2>From candidate to payslip in four steps</h2><p>One calculation powers the form, the breakdown and the preview, so the numbers always match.</p></div>
<a class="b p" href="Main.dc.html">Open payslip dashboard →</a>
</div>
<ol class="sl">
<li><b>1</b><span>Select client and candidate<small>Identity details fill in automatically</small></span></li>
<li><b>2</b><span>Enter salary and attendance<small>Live validation on every field</small></span></li>
<li><b>3</b><span>Review breakdown and preview<small>Earnings, deductions and net pay</small></span></li>
<li><b>4</b><span>Prepare distribution<small>Confirm the recipient. Nothing is sent until you do</small></span></li>
</ol>
</div></section>

<section class="sec" id="contact" style="padding-top:0"><div class="w">
<div class="cg">
<div class="cc"><h3>For job seekers</h3><p>Upload your CV and let our consultants connect you with roles that match your skills and aspirations.</p><a class="b" href="#top">Browse jobs</a></div>
<div class="cc d"><h3>For employers</h3><p>Partner with us to find exceptional talent and build high-performing teams.</p><a class="b" href="#top" style="background:transparent;color:#fff">Post a job</a></div>
</div>
</div></section>

<footer class="ft"><div class="w">
<div><div class="lg" style="color:#fff;margin-bottom:10px">Derive <small style="color:#9AA7BE">Recruiting</small></div>Derive Management Solutions Pvt Ltd</div>
<div><h4>Products</h4><a href="#products">ATS</a><a href="#products">CRM</a><a href="#products">AI Interviews</a><a href="Main.dc.html">Payroll</a></div>
<div><h4>Company</h4><a href="#impact">Impact</a><a href="#clients">Clients</a><a href="#contact">Contact</a></div>
<div class="cp">© 2026 Derive Recruiting. Front-end prototype with sample data.</div>
</div></footer>

</div>`;

export function HomePage({ onGeneratePayslip }: HomePageProps) {
  const handleDashboardClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest<HTMLAnchorElement>('a[href="Main.dc.html"]');
    if (!link) return;

    event.preventDefault();
    onGeneratePayslip();
  };

  return (
    <div
      className="derive-homepage"
      onClick={handleDashboardClick}
      dangerouslySetInnerHTML={{ __html: HOME_PAGE_MARKUP }}
    />
  );
}
