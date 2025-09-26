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

  // Mock данные для графика отзывов
  const reviewsData = [
    { month: 'янв', value: 50 },
    { month: 'фев', value: 130 },
    { month: 'мар', value: 120 },
    { month: 'апр', value: 100 },
    { month: 'май', value: 80 },
    { month: 'июн', value: 90 },
    { month: 'июл', value: 110 },
    { month: 'авг', value: 95 },
    { month: 'сен', value: 85 },
    { month: 'окт', value: 70 },
    { month: 'ноя', value: 60 },
    { month: 'дек', value: 45 }
  ]

  // Mock данные для тематики
  const topicsData = [
    { label: 'Обслуживание клиентов', color: '#FF6B35', value: 35 },
    { label: 'Мобильное приложение', color: '#FFD23F', value: 25 },
    { label: 'Карты', color: '#06D6A0', value: 20 },
    { label: 'Кредиты', color: '#118AB2', value: 15 },
    { label: 'Вклады', color: '#EF476F', value: 5 }
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
                  <span>300</span>
                  <span>200</span>
                  <span>100</span>
                  <span>0</span>
                </div>
                
                <div className="line-chart__content">
                  <svg className="line-chart__svg" viewBox="0 0 800 200">
                    <polyline
                      className="line-chart__line"
                      points={reviewsData.map((item, index) => 
                        `${(index * 60) + 30},${200 - (item.value * 1.5)}`
                      ).join(' ')}
                      fill="none"
                      stroke="#2b61ec"
                      strokeWidth="3"
                    />
                    {reviewsData.map((item, index) => (
                      <circle
                        key={index}
                        className="line-chart__point"
                        cx={(index * 60) + 30}
                        cy={200 - (item.value * 1.5)}
                        r="4"
                        fill="#2b61ec"
                      />
                    ))}
                    {/* Подсветка пика в феврале */}
                    <circle
                      className="line-chart__highlight"
                      cx={90}
                      cy={200 - (130 * 1.5)}
                      r="6"
                      fill="#2b61ec"
                    />
                  </svg>
                  
                  <div className="line-chart__tooltip">
                    <div className="tooltip">
                      <div className="tooltip__title">Пик</div>
                      <div className="tooltip__value">130 отзывов</div>
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
                  <div className="pie-chart__placeholder"></div>
                </div>
                
                <div className="pie-chart__legend">
                  {topicsData.map((topic, index) => (
                    <div key={index} className="pie-chart__legend-item">
                      <div 
                        className="pie-chart__legend-dot"
                        style={{ backgroundColor: topic.color }}
                      ></div>
                      <span className="pie-chart__legend-label">{topic.label}</span>
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