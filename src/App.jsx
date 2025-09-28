import React, { useState } from 'react'
import './App.css'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('Главная')
  const [selectedFilter, setSelectedFilter] = useState('total')

  const menuItems = [
    'Главная',
    'Кластеризация', 
    'Тестирование',
    'Документация',
    'Логи'
  ]

  // Mock данные для графика отзывов - реальные данные по отзывам Газпромбанка
  const reviewsData = [
    { month: 'янв', value: 247, total: 247, processed: 198 },
    { month: 'фев', value: 312, total: 312, processed: 281 },
    { month: 'мар', value: 289, total: 289, processed: 267 },
    { month: 'апр', value: 356, total: 356, processed: 334 },
    { month: 'май', value: 298, total: 298, processed: 276 },
    { month: 'июн', value: 423, total: 423, processed: 401 },
    { month: 'июл', value: 387, total: 387, processed: 365 },
    { month: 'авг', value: 445, total: 445, processed: 423 },
    { month: 'сен', value: 398, total: 398, processed: 378 },
    { month: 'окт', value: 467, total: 467, processed: 445 },
    { month: 'ноя', value: 512, total: 512, processed: 489 },
    { month: 'дек', value: 478, total: 478, processed: 456 }
  ]

  // Функция для получения данных в зависимости от выбранного фильтра
  const getCurrentData = () => {
    return reviewsData.map(item => ({
      ...item,
      value: selectedFilter === 'total' ? item.total : item.processed
    }))
  }

  // Найти максимальное значение для масштабирования графика
  const maxValue = Math.max(...reviewsData.map(item => item.total))
  const currentMaxValue = Math.max(...getCurrentData().map(item => item.value))
  
  // Округляем максимальное значение для красивой шкалы
  const roundedMax = Math.ceil(currentMaxValue / 100) * 100
  const chartHeight = 180 // Высота области графика в SVG

  // Mock данные для тематики - распределение отзывов по категориям
  const topicsData = [
    { label: 'Обслуживание клиентов', color: '#FF6B35', value: 42, count: 1847 },
    { label: 'Мобильное приложение', color: '#FFD23F', value: 28, count: 1232 },
    { label: 'Банковские карты', color: '#06D6A0', value: 18, count: 792 },
    { label: 'Кредитные продукты', color: '#118AB2', value: 8, count: 352 },
    { label: 'Депозитные услуги', color: '#EF476F', value: 4, count: 176 }
  ]

  return (
    <div className="app">
      {/* Левое меню */}
      <nav className="sidebar">
        <div className="sidebar__header">
          <h2 className="sidebar__title">Меню</h2>
        </div>
        <div className="sidebar__menu">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              className={`sidebar__item ${activeMenuItem === item ? 'sidebar__item--active' : ''}`}
              onClick={() => setActiveMenuItem(item)}
            >
              <div className="sidebar__icon">
                <div className="sidebar__icon-grid">
                  <div className="sidebar__icon-square"></div>
                  <div className="sidebar__icon-square"></div>
                  <div className="sidebar__icon-square"></div>
                  <div className="sidebar__icon-square"></div>
                </div>
              </div>
              <span className="sidebar__label">{item}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Основной контент */}
      <main className="main">
        <div className="main__header">
          <h1 className="main__title">Дашборд</h1>
        </div>

        <div className="dashboard">
          {/* Карточка статистики по отзывам */}
          <div className="card card--large">
            <div className="card__header">
              <h3 className="card__title">Статистика по количеству отзывов</h3>
            </div>
            
            <div className="card__filters">
              <label className="filter-radio">
                <input 
                  type="radio" 
                  name="reviews-filter"
                  value="total"
                  checked={selectedFilter === 'total'}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                />
                <span className="filter-radio__label">Общее количество отзывов</span>
              </label>
              
              <label className="filter-radio">
                <input 
                  type="radio" 
                  name="reviews-filter"
                  value="processed"
                  checked={selectedFilter === 'processed'}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                />
                <span className="filter-radio__label">Обработанные отзывы</span>
              </label>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={getCurrentData()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6c757d' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6c757d' }}
                    domain={[0, roundedMax]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e9ecef',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    labelStyle={{ color: '#6c757d', fontSize: '12px' }}
                    formatter={(value) => [`${value} ${selectedFilter === 'total' ? 'отзывов' : 'обработано'}`, 'Количество']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2b61ec" 
                    strokeWidth={3}
                    dot={{ fill: '#2b61ec', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#2b61ec', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Карточка статистики по тематике */}
          <div className="card card--small">
            <div className="card__header">
              <h3 className="card__title">Статистика по тематике</h3>
            </div>
            
                <div className="pie-chart">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={topicsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={2}
                        paddingAngle={2}
                        animationBegin={0}
                        animationDuration={300}
                      >
                        {topicsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            style={{
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                              transition: 'all 0.3s ease'
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [`${value}%`, props.payload.label]}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pie-chart__legend">
                    {topicsData.map((topic, index) => (
                      <div key={index} className="pie-chart__legend-item">
                        <div
                          className="pie-chart__legend-dot"
                          style={{ backgroundColor: topic.color }}
                        ></div>
                        <div className="pie-chart__legend-text">
                          <span className="pie-chart__legend-label">{topic.label}</span>
                          <span className="pie-chart__legend-value">{topic.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App