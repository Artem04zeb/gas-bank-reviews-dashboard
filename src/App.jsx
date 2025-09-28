import React, { useState } from 'react'
import './App.css'

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
                <div className="line-chart">
                  <div className="line-chart__y-axis">
                    <span>{Math.ceil(currentMaxValue / 100) * 100}</span>
                    <span>{Math.ceil(currentMaxValue / 100) * 75}</span>
                    <span>{Math.ceil(currentMaxValue / 100) * 50}</span>
                    <span>{Math.ceil(currentMaxValue / 100) * 25}</span>
                    <span>0</span>
                  </div>
                
                <div className="line-chart__content">
                  <svg className="line-chart__svg" viewBox="0 0 800 200">
                    <polyline
                      className="line-chart__line"
                      points={getCurrentData().map((item, index) => 
                        `${(index * 60) + 30},${200 - (item.value / currentMaxValue * 180)}`
                      ).join(' ')}
                      fill="none"
                      stroke="#2b61ec"
                      strokeWidth="3"
                    />
                    {getCurrentData().map((item, index) => (
                      <circle
                        key={index}
                        className="line-chart__point"
                        cx={(index * 60) + 30}
                        cy={200 - (item.value / currentMaxValue * 180)}
                        r="4"
                        fill="#2b61ec"
                      />
                    ))}
                    {/* Подсветка пикового месяца */}
                    {(() => {
                      const peakData = getCurrentData().reduce((max, item, index) => 
                        item.value > max.value ? { ...item, index } : max, 
                        getCurrentData()[0]
                      )
                      return (
                        <circle
                          className="line-chart__highlight"
                          cx={(peakData.index * 60) + 30}
                          cy={200 - (peakData.value / currentMaxValue * 180)}
                          r="6"
                          fill="#2b61ec"
                        />
                      )
                    })()}
                  </svg>
                  
                  <div className="line-chart__tooltip">
                    <div className="tooltip">
                      <div className="tooltip__title">Пик</div>
                      <div className="tooltip__value">
                        {(() => {
                          const peakData = getCurrentData().reduce((max, item) => 
                            item.value > max.value ? item : max, 
                            getCurrentData()[0]
                          )
                          return `${peakData.value} ${selectedFilter === 'total' ? 'отзывов' : 'обработано'}`
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="line-chart__x-axis">
                  {reviewsData.map((item, index) => (
                    <span key={index} className="line-chart__x-label">{item.month}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Карточка статистики по тематике */}
          <div className="card card--small">
            <div className="card__header">
              <h3 className="card__title">Статистика по тематике</h3>
            </div>
            
                <div className="pie-chart">
                  <div className="pie-chart__container">
                    <div className="pie-chart__chart">
                      <svg width="180" height="180" viewBox="0 0 180 180">
                        <circle
                          cx="90"
                          cy="90"
                          r="80"
                          fill="none"
                          stroke="#e0e0e0"
                          strokeWidth="20"
                        />
                        {(() => {
                          let currentAngle = 0
                          const total = topicsData.reduce((sum, topic) => sum + topic.value, 0)
                          
                          return topicsData.map((topic, index) => {
                            const percentage = topic.value / total
                            const angle = percentage * 360
                            const startAngle = currentAngle
                            const endAngle = currentAngle + angle
                            
                            const startAngleRad = (startAngle - 90) * Math.PI / 180
                            const endAngleRad = (endAngle - 90) * Math.PI / 180
                            
                            const x1 = 90 + 80 * Math.cos(startAngleRad)
                            const y1 = 90 + 80 * Math.sin(startAngleRad)
                            const x2 = 90 + 80 * Math.cos(endAngleRad)
                            const y2 = 90 + 80 * Math.sin(endAngleRad)
                            
                            const largeArcFlag = angle > 180 ? 1 : 0
                            
                            const pathData = [
                              `M 90 90`,
                              `L ${x1} ${y1}`,
                              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                              `Z`
                            ].join(' ')
                            
                            currentAngle += angle
                            
                            return (
                              <path
                                key={index}
                                d={pathData}
                                fill={topic.color}
                                stroke="white"
                                strokeWidth="2"
                              />
                            )
                          })
                        })()}
                      </svg>
                    </div>

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
        </div>
      </main>
    </div>
  )
}

export default App