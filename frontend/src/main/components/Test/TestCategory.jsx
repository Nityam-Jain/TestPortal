import React from 'react'
import Badge from './Badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './Card'
import Button from './Button'
import { ArrowRight, Award, BarChart3, Zap } from 'lucide-react'

function TestCategory() {
  const categories = [
    {
      icon: <BarChart3 className="h-6 w-6 text-[#1B3C53]" />,
      badge: '156 Tests',
      title: 'Programming & Development',
      description:
        'Test your coding skills across multiple programming languages and frameworks',
      items: [
        { name: 'JavaScript', count: 45 },
        { name: 'Python', count: 38 },
        { name: 'React', count: 29 }
      ]
    },
    {
      icon: <Award className="h-6 w-6 text-[#1B3C53]" />,
      badge: '89 Tests',
      title: 'Business & Management',
      description:
        'Enhance your business acumen with comprehensive management assessments',
      items: [
        { name: 'Project Management', count: 25 },
        { name: 'Leadership', count: 22 },
        { name: 'Strategy', count: 18 }
      ]
    },
    {
      icon: <Zap className="h-6 w-6 text-[#1B3C53]" />,
      badge: '124 Tests',
      title: 'Digital Marketing',
      description:
        'Master modern marketing strategies and digital advertising techniques',
      items: [
        { name: 'SEO & SEM', count: 32 },
        { name: 'Social Media', count: 28 },
        { name: 'Analytics', count: 24 }
      ]
    }
  ]

  return (
    <section className="py-20 bg-[#F7F3F0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1B3C53] mb-4">
            Popular Test Categories
          </h2>
          <p className="text-lg text-[#456882] max-w-2xl mx-auto">
            Choose from our wide range of test categories designed to help you
            excel in your field
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <Card
              key={i}
              className="hover:shadow-xl transition-shadow border-0 bg-white rounded-xl"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-[#1B3C53]/10 p-3 rounded-lg">
                    {cat.icon}
                  </div>
                  <Badge variant="secondary">{cat.badge}</Badge>
                </div>
                <CardTitle>{cat.title}</CardTitle>
                <CardDescription>{cat.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 mb-4">
                  {cat.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex justify-between text-sm text-[#1B3C53]"
                    >
                      <span>{item.name}</span>
                      <span className="text-[#456882]">{item.count} tests</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full">
                  Start Testing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestCategory
