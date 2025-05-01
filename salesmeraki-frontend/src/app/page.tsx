'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import TopNav from '@/components/layout/TopNav';
import { useCurrency } from '@/contexts/CurrencyContext';
import {
  ChartBarSquareIcon,
  RocketLaunchIcon,
  ChatBubbleLeftRightIcon,
  PresentationChartBarIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  PlayIcon,
  CalculatorIcon,
  SparklesIcon,
  CpuChipIcon,
  BoltIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,  // Add this import
  // Remove CheckCircleIcon from solid since we're using it from outline
} from '@heroicons/react/24/solid';
import {
  HeartIcon,
  BuildingLibraryIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  PresentationChartLineIcon,
  BuildingStorefrontIcon, // Use this instead of BuildingOffice2Icon
  ShoppingBagIcon,
  ScaleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  BookOpenIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline';

// Update features with more modern icons and descriptions
const features = [
  {
    title: 'AI-Powered Automation',
    description: 'Streamline workflows with cutting-edge AI technology.',
    icon: CpuChipIcon,
  },
  {
    title: 'Intelligent Analytics',
    description: 'Real-time insights powered by advanced algorithms.',
    icon: SparklesIcon,
  },
  {
    title: 'Lightning-Fast Results',
    description: 'Accelerate your sales cycle with smart automation.',
    icon: BoltIcon,
  },
];

const testimonials = [
  {
    quote: "SalesMeraki transformed our sales operations! Our close rates increased by 32% within three months.",
    author: "David S.",
    role: "VP of Sales at GrowthX",
  },
  {
    quote: "The AI-driven coaching and analytics gave our reps the confidence and data they needed to close high-value deals!",
    author: "Sarah K.",
    role: "Sales Director at NexaTech",
  },
  {
    quote: "We integrated SalesMeraki with our CRM, and the results were phenomenal! The predictive insights gave us a 40% boost in sales productivity.",
    author: "Michael L.",
    role: "CEO of SwiftSales",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    priceValue: 29,
    features: ["AI insights", "Basic analytics", "CRM integration", "Workflow automation"],
  },
  {
    name: "Pro",
    priceValue: 79,
    features: ["Everything in Starter", "Real-time coaching", "AI chatbots", "Advanced analytics"],
  },
  {
    name: "Enterprise",
    priceValue: null,
    priceLabel: "Custom",
    features: ["Everything in Pro", "Custom AI models", "Dedicated support", "API access"],
  },
];

const useCases = [
  {
    industry: 'B2B SaaS Companies',
    icon: BuildingStorefrontIcon, // Changed from BuildingOffice2Icon
    challenge: 'Long sales cycles and inefficient lead nurturing.',
    solution: "SalesMeraki's AI-driven analytics prioritizes high-converting leads and streamlines follow-ups.",
    metrics: {
      improvement: '45%',
      metric: 'shorter sales cycles'
    }
  },
  {
    industry: 'E-commerce & Retail',
    icon: ShoppingBagIcon,
    challenge: 'Low customer retention and abandoned carts.',
    solution: 'AI-powered chatbots engage prospects instantly, increasing conversions and retention.',
    metrics: {
      improvement: '32%',
      metric: 'higher conversion rate'
    }
  },
  {
    industry: 'Healthcare & MedTech Sales',
    icon: HeartIcon,
    challenge: 'Complex compliance and long decision-making processes.',
    solution: 'SalesMeraki automates compliance documentation and optimizes sales outreach with AI insights.',
    metrics: {
      improvement: '60%',
      metric: 'faster compliance checks'
    }
  },
  {
    industry: 'Real Estate & Financial Services',
    icon: BuildingLibraryIcon,
    challenge: 'Tracking leads across multiple platforms and slow deal closures.',
    solution: 'Seamless CRM integration and real-time AI coaching accelerate closings and improve conversions.',
    metrics: {
      improvement: '38%',
      metric: 'faster deal closure'
    }
  }
];

const comparisonFeatures = [
  {
    feature: 'AI-Powered Sales Coaching',
    salesmeraki: true,
    traditional: false,
    others: 'limited'
  },
  {
    feature: 'Real-Time Sales Analytics',
    salesmeraki: true,
    traditional: 'limited',
    others: true
  },
  {
    feature: 'AI-Driven Market Research',
    salesmeraki: true,
    traditional: false,
    others: 'limited'
  },
  {
    feature: 'CRM Integration (Salesforce, HubSpot)',
    salesmeraki: true,
    traditional: true,
    others: true
  },
  {
    feature: 'Predictive Lead Scoring',
    salesmeraki: true,
    traditional: false,
    others: 'limited'
  },
  {
    feature: 'AI Chatbots & Smart Assistants',
    salesmeraki: true,
    traditional: false,
    others: 'limited'
  },
  {
    feature: 'Customizable Workflows',
    salesmeraki: true,
    traditional: 'limited',
    others: true
  },
  {
    feature: 'Dedicated AI Support',
    salesmeraki: true,
    traditional: false,
    others: false
  }
];

const faqs = [
  {
    question: 'What makes SalesMeraki different from a regular CRM?',
    answer: 'SalesMeraki is more than a CRM—it analyzes sales data with AI, provides coaching, and predicts winning sales strategies to help your team close deals faster.'
  },
  {
    question: 'Can I integrate SalesMeraki with my existing CRM?',
    answer: 'Absolutely! SalesMeraki seamlessly integrates with Salesforce, HubSpot, and other CRMs to enhance your existing sales process.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes! We use enterprise-grade encryption and compliance standards to protect your data.'
  },
  {
    question: 'Does SalesMeraki support team collaboration?',
    answer: 'Yes! Sales teams can share insights, track deals, and collaborate in real-time within the platform.'
  },
  {
    question: 'Can I try SalesMeraki before committing?',
    answer: 'Yes! We offer a free trial so you can experience the power of AI-driven sales enablement firsthand.'
  }
];

// Add new ROI calculator interface
interface ROICalculation {
  teamSize: number;
  closeRate: number;
  dealSize: number;
}

export default function Home() {
  const { formatAmount, convertAmount } = useCurrency();
  const { status } = useSession();
  const [roiData, setRoiData] = useState<ROICalculation>({
    teamSize: 0,
    closeRate: 0,
    dealSize: 0
  });
  const [calculatedROI, setCalculatedROI] = useState<any>(null);

  // Add navigation handler for pricing plans
  const handlePricingClick = (planName: string) => {
    if (status === "authenticated") {
      window.location.href = `/billing/subscribe?plan=${planName.toLowerCase()}`;
    } else {
      window.location.href = `/auth/signup?plan=${planName.toLowerCase()}`;
    }
  };

  const calculateROI = () => {
    // Enhanced ROI calculation logic
    const projectedImprovement = 0.32; // 32% improvement
    const annualRevenue = roiData.teamSize * (roiData.closeRate / 100) * roiData.dealSize * 12;
    const projectedRevenue = annualRevenue * (1 + projectedImprovement);

    setCalculatedROI({
      revenueIncrease: projectedRevenue - annualRevenue,
      productivityGain: '32%',
      timeSaved: '15 hours/month/rep'
    });
  };

  return (
    <main className="min-h-screen bg-background-light" role="main">
      <TopNav />

      {/* Hero Section */}
      <section
        aria-label="Hero"
        className="hero-container"
      >
        <div className="section-container hero-content">
          <h1 className="hero-title">
            AI-Powered Sales Enablement for{' '}
            <span className="gradient-text inline-block">High-Performing Teams</span>
          </h1>
          <p className="hero-description">
            Transform your sales process with cutting-edge AI technology that helps you close more deals and grow faster.
          </p>
          <div className="flex gap-6 justify-center">
            <Link
              href="/demo-request"
              className="btn-secondary-enhanced"
            >
              Schedule a Demo
            </Link>
            <Link
              href={status === "authenticated" ? "/dashboard" : "/auth/signup"}
              className="btn-primary-enhanced"
            >
              {status === "authenticated" ? "Go to Dashboard" : "Get Started Free"}
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" role="separator" />

      {/* Features Section */}
      <section
        aria-label="Features"
        className="section-spacing bg-white"
      >
        <div className="section-container">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need to supercharge your sales team
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Link
                href={`/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                key={index}
                className="feature-card hover:shadow-lg transition-shadow duration-300"
                role="article"
              >
                <feature.icon className="feature-icon" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" role="separator" />

      {/* Industry Use Cases */}
      <section
        aria-label="Industry Use Cases"
        className="section-spacing bg-gray-50"
      >
        <div className="section-container">
          <h2 className="section-title flex items-center justify-center gap-3">
            <ArrowTrendingUpIcon className="h-8 w-8 text-primary" />
            Industry-Specific Use Cases
          </h2>
          <p className="section-subtitle">
            Discover how SalesMeraki transforms sales across different industries
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <useCase.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {useCase.industry}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Challenge
                        </p>
                        <p className="mt-1 text-gray-700">
                          {useCase.challenge}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Solution
                        </p>
                        <p className="mt-1 text-gray-700">
                          {useCase.solution}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold text-primary">
                            {useCase.metrics.improvement}
                          </span>
                          <span className="ml-2 text-gray-600">
                            {useCase.metrics.metric}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-8 text-center">
        <Link
          href="/case-studies"
          className="btn-primary-enhanced"
        >
          View All Case Studies
        </Link>
      </div>

      {/* Comparison Table */}
      <section className="section-spacing bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <ScaleIcon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="section-title">SalesMeraki vs. Other Platforms</h2>
            <p className="section-subtitle">See how we stack up against the competition</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Feature
                    </th>
                    <th className="bg-primary/5 px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-primary font-bold text-lg">SalesMeraki 🚀</span>
                        <span className="text-sm text-primary/70">AI-Powered Platform</span>
                      </div>
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-gray-700">Traditional CRM</span>
                        <span className="text-sm text-gray-500">Legacy Systems</span>
                      </div>
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-gray-700">Other AI Tools</span>
                        <span className="text-sm text-gray-500">Competitors</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFeatures.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      } hover:bg-gray-50 transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.feature}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-700">Yes</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.traditional === true ? (
                          <div className="flex items-center justify-center space-x-1">
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            <span className="text-sm text-green-700">Yes</span>
                          </div>
                        ) : item.traditional === 'limited' ? (
                          <div className="flex items-center justify-center space-x-1">
                            <MinusCircleIcon className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm text-yellow-700">Basic</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-1">
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-red-700">No</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.others === true ? (
                          <div className="flex items-center justify-center space-x-1">
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            <span className="text-sm text-green-700">Yes</span>
                          </div>
                        ) : item.others === 'limited' ? (
                          <div className="flex items-center justify-center space-x-1">
                            <MinusCircleIcon className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm text-yellow-700">Limited</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-1">
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-red-700">No</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-primary">
              🚀 Get more features and better AI insights with SalesMeraki!
            </p>
            <div className="mt-6">
              <button className="btn-primary-enhanced">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section
        aria-label="FAQs"
        className="section-spacing bg-gray-50"
      >
        <div className="section-container">
          <div className="text-center mb-12">
            <QuestionMarkCircleIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know about SalesMeraki</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <ChevronDownIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        aria-label="Testimonials"
        className="section-spacing bg-gray-50"
      >
        <div className="section-container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <figure
                key={index}
                className="testimonial-card"
                role="group"
              >
                <blockquote>
                  <p className="text-lg text-gray-700 mb-6">
                    "{testimonial.quote}"
                  </p>
                </blockquote>
                <figcaption className="mt-4">
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-primary-dark">
                    {testimonial.role}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" role="separator" />

      {/* Case Study Section */}
      <section className="section-spacing bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <PresentationChartLineIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="section-title">Success Story</h2>
            <p className="section-subtitle">How SalesMeraki Transformed Sales Operations</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-8 text-white">
              <div className="flex items-center space-x-4">
                <BuildingOfficeIcon className="h-8 w-8" />
                <div>
                  <h3 className="text-2xl font-bold">NexaTech Solutions</h3>
                  <p className="text-primary-light">B2B Technology Solutions Provider</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-primary/5 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">45%</div>
                  <div className="text-gray-600">Revenue Increase</div>
                </div>
                <div className="bg-primary/5 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">30%</div>
                  <div className="text-gray-600">Productivity Boost</div>
                </div>
                <div className="bg-primary/5 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50%</div>
                  <div className="text-gray-600">Faster Response Time</div>
                </div>
              </div>

              {/* Challenge and Solution */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 text-xl font-semibold text-gray-900 mb-4">
                    <ChartBarIcon className="h-6 w-6 text-primary" />
                    <h4>The Challenge</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Sales reps lacked structured workflows and data-driven insights',
                      'Low engagement with high-value leads',
                      'No real-time analytics to track performance'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        </span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-3 text-xl font-semibold text-gray-900 mb-4">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-primary" />
                    <h4>The Solution</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Implemented AI-driven coaching and workflow automation',
                      'Deployed conversational AI for real-time assistance',
                      'Integrated seamlessly with existing Salesforce CRM'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="h-2 w-2 rounded-full bg-primary"></span>
                        </span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Results */}
              <div>
                <div className="flex items-center space-x-3 text-xl font-semibold text-gray-900 mb-6">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  <h4>Key Results</h4>
                </div>
                <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-6">
                  <ul className="grid md:grid-cols-2 gap-4">
                    {[
                      '45% increase in revenue within six months',
                      '30% improvement in sales rep productivity',
                      'Reduced lead response time by 50%',
                      'Higher conversion rates across all segments'
                    ].map((result, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        aria-label="Pricing"
        className="section-spacing bg-white"
      >
        <div className="section-container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">
            Choose the plan that best fits your needs
          </p>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className="pricing-card"
                role="article"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-primary">
                    {plan.priceValue ? formatAmount(plan.priceValue, true) : plan.priceLabel}
                    <span className="text-base text-gray-500">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8" role="list">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <CheckBadgeIcon className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePricingClick(plan.name)}
                  className="btn-primary-enhanced w-full"
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" role="separator" />

      {/* ROI Calculator Section */}
      <section aria-label="ROI Calculator" className="section-spacing bg-gradient-to-b from-gray-50 to-white">
        <div className="section-container">
          <h2 className="section-title">Calculate Your ROI</h2>
          <p className="section-subtitle">
            See how SalesMeraki can impact your bottom line
          </p>
          {/* Increased max-width for better content distribution */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
              {/* Input Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
                {/* Team Size Input */}
                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sales Team Size
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserGroupIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-3 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Number of sales reps"
                      value={roiData.teamSize || ''}
                      onChange={(e) => setRoiData({...roiData, teamSize: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                {/* Close Rate Input */}
                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Close Rate (%)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalculatorIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-3 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Average close rate"
                      value={roiData.closeRate || ''}
                      onChange={(e) => setRoiData({...roiData, closeRate: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                {/* Deal Size Input */}
                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average Deal Size
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-3 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Average deal value"
                      value={roiData.dealSize || ''}
                      onChange={(e) => setRoiData({...roiData, dealSize: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <div className="text-center mb-8">
                <button
                  onClick={calculateROI}
                  className="btn-primary-enhanced inline-flex items-center"
                  disabled={!roiData.teamSize || !roiData.closeRate || !roiData.dealSize}
                >
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Calculate ROI
                </button>
              </div>

              {/* Results Section */}
              {calculatedROI && (
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    Your Projected Results with SalesMeraki
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 sm:p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                        {formatAmount(calculatedROI.revenueIncrease, true)}
                      </div>
                      <p className="text-gray-600">Additional Annual Revenue</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 sm:p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                        {calculatedROI.productivityGain}
                      </div>
                      <p className="text-gray-600">Productivity Increase</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 sm:p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-primary mb-2 break-words hyphens-auto">
                        {calculatedROI.timeSaved.split('/').join('/ ')}
                      </div>
                      <p className="text-gray-600">Time Saved Per Rep</p>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <Link
                      href="/demo-request"
                      className="btn-secondary-enhanced inline-flex items-center"
                    >
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Schedule a Demo to Learn More
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        aria-label="Call to Action"
        className="section-spacing gradient-bg"
      >
        <div className="section-container text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to Transform Your Sales?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of high-performing sales teams using our platform
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/demo-request"
              className="btn-white"
            >
              Schedule a Demo
            </Link>
            <Link
              href={status === "authenticated" ? "/dashboard" : "/auth/signup"}
              className="btn-primary-enhanced"
            >
              {status === "authenticated" ? "Go to Dashboard" : "Start Free Trial"}
            </Link>
          </div>
        </div>
      </section>

      {/* Support & Resources Section */}
      <section className="section-spacing bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/support"
              className="resource-card"
            >
              <QuestionMarkCircleIcon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Support Center</h3>
              <p className="text-gray-600">Get help from our expert support team</p>
            </Link>
            <Link
              href="/documentation"
              className="resource-card"
            >
              <BookOpenIcon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Documentation</h3>
              <p className="text-gray-600">Detailed guides and API references</p>
            </Link>
            <Link
              href="/blog"
              className="resource-card"
            >
              <NewspaperIcon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Blog & Updates</h3>
              <p className="text-gray-600">Latest features and best practices</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
