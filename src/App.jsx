import React, { useState } from 'react'
import './App.css'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('Главная')
  const [selectedFilter, setSelectedFilter] = useState('total')
  const [selectedClass, setSelectedClass] = useState('Все')
  const [selectedTimeRange, setSelectedTimeRange] = useState('all-time')
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [testingData, setTestingData] = useState(null)
  const [testingMetrics, setTestingMetrics] = useState({
    accuracy: 0.847,
    f1Micro: 0.823
  })

  // Функции для работы с файлами
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result)
          setTestingData(jsonData)
          // Симуляция обновления метрик на основе загруженных данных
          setTestingMetrics({
            accuracy: Math.random() * 0.2 + 0.8, // 0.8-1.0
            f1Micro: Math.random() * 0.2 + 0.75   // 0.75-0.95
          })
        } catch (error) {
          alert('Ошибка при чтении JSON файла')
        }
      }
      reader.readAsText(file)
    } else {
      alert('Пожалуйста, выберите JSON файл')
    }
  }

  const handleDownloadJson = () => {
    if (!testingData) {
      alert('Нет данных для скачивания')
      return
    }
    
    const dataStr = JSON.stringify(testingData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'testing_results.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

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

  // Данные для карточек классов на странице кластеризации
  const classCards = [
    { id: 'Все', label: 'Все', color: '#2b61ec' },
    { id: 'Обслуживание', label: 'Обслуживание', color: '#FF6B35' },
    { id: 'Кредитные карты', label: 'Кредитные карты', color: '#06D6A0' },
    { id: 'Вклады', label: 'Вклады', color: '#118AB2' },
    { id: 'Депозиты', label: 'Депозиты', color: '#EF476F' },
    { id: 'Мобильное приложение', label: 'Мобильное приложение', color: '#FFD23F' },
    { id: 'Мобильное приложение2', label: 'Мобильное приложение', color: '#9B59B6' },
    { id: 'Мобильное приложение3', label: 'Мобильное приложение', color: '#E67E22' }
  ]

  // Данные для выбора временного диапазона
  const timeRangeOptions = [
    { id: 'all-time', label: 'Всё время' },
    { id: 'last-month', label: 'Месяц' },
    { id: 'last-6-months', label: 'Полгода' },
    { id: 'last-12-months', label: 'Год' },
    { id: 'custom', label: 'Указать даты' }
  ]

  // Функция для рендера содержимого дашборда
  const renderDashboardContent = (pageTitle) => (
    <>
      <div className="main__header">
        <h1 className="main__title">{pageTitle}</h1>
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
    </>
  )

  // Функция для рендера страницы кластеризации
  const renderClusteringPage = () => (
    <>
      <div className="main__header">
        <h1 className="main__title">Кластеризация</h1>
      </div>

      {/* Карточки выбора класса */}
      <div className="class-cards">
        <div className="class-cards__container">
          {classCards.map((classCard) => (
            <div
              key={classCard.id}
              className={`class-card ${selectedClass === classCard.id ? 'class-card--active' : ''}`}
              data-class={classCard.id}
              onClick={() => setSelectedClass(classCard.id)}
              style={{
                borderColor: selectedClass === classCard.id ? classCard.color : (classCard.id === 'Все' ? '#c5d9f1' : 'transparent'),
                backgroundColor: selectedClass === classCard.id ? `${classCard.color}10` : (classCard.id === 'Все' ? 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)' : '#ffffff')
              }}
            >
              <div 
                className="class-card__indicator"
                style={{ backgroundColor: classCard.color }}
              ></div>
              <span className="class-card__label">{classCard.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Выбор временного диапазона */}
      <div className="time-range-selector">
        <div className="time-range-selector__container">
          <div className="time-range-selector__label">
            <span>Временной диапазон:</span>
          </div>
          <div className="time-range-selector__options">
            {timeRangeOptions.map((option) => (
              <label key={option.id} className="time-range-option">
                <input
                  type="radio"
                  name="time-range"
                  value={option.id}
                  checked={selectedTimeRange === option.id}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                />
                <span className="time-range-option__label">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Кастомный выбор дат */}
        {selectedTimeRange === 'custom' && (
          <div className="custom-date-range">
            <div className="custom-date-range__container">
              <div className="custom-date-range__field">
                <label className="custom-date-range__label">От:</label>
                <input
                  type="date"
                  className="custom-date-range__input"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                />
              </div>
              <div className="custom-date-range__field">
                <label className="custom-date-range__label">До:</label>
                <input
                  type="date"
                  className="custom-date-range__input"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Дашборд с графиками */}
      <div className="dashboard">
        {/* Карточка статистики по отзывам */}
        <div className="card card--large">
          <div className="card__header">
            <h3 className="card__title">
              {selectedClass === 'Все' 
                ? 'Статистика по количеству отзывов - Общая статистика' 
                : `Статистика по количеству отзывов - ${selectedClass}`}
            </h3>
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
                  stroke={classCards.find(c => c.id === selectedClass)?.color || '#2b61ec'} 
                  strokeWidth={3}
                  dot={{ fill: classCards.find(c => c.id === selectedClass)?.color || '#2b61ec', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: classCards.find(c => c.id === selectedClass)?.color || '#2b61ec', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Карточка статистики по тематике */}
        <div className="card card--small">
          <div className="card__header">
            <h3 className="card__title">
              {selectedClass === 'Все' 
                ? 'Статистика по тематике - Общая статистика' 
                : `Кластеры для категории: ${selectedClass}`}
            </h3>
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
    </>
  )

  // Функция для рендера страницы тестирования
  const renderTestingPage = () => (
    <>
      <div className="main__header">
        <h1 className="main__title">Тестирование</h1>
      </div>

      {/* Панель загрузки и метрик */}
      <div className="testing-panel">
        <div className="testing-panel__container">
          {/* Загрузка файла */}
          <div className="file-upload-section">
            <h3 className="file-upload-section__title">Загрузить данные для тестирования</h3>
            <div className="file-upload">
              <input
                type="file"
                id="json-upload"
                accept=".json"
                onChange={handleFileUpload}
                className="file-upload__input"
              />
              <label htmlFor="json-upload" className="file-upload__label">
                <span className="file-upload__icon">📁</span>
                <span className="file-upload__text">
                  {testingData ? 'Файл загружен' : 'Выберите JSON файл'}
                </span>
              </label>
            </div>
          </div>

          {/* Ключевые показатели */}
          <div className="metrics-section">
            <h3 className="metrics-section__title">Ключевые показатели</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-card__label">Accuracy</div>
                <div className="metric-card__value">{(testingMetrics.accuracy * 100).toFixed(1)}%</div>
              </div>
              <div className="metric-card">
                <div className="metric-card__label">F1-Micro</div>
                <div className="metric-card__value">{(testingMetrics.f1Micro * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Скачивание файла */}
          <div className="download-section">
            <h3 className="download-section__title">Экспорт результатов</h3>
            <button
              className="download-button"
              onClick={handleDownloadJson}
              disabled={!testingData}
            >
              <span className="download-button__icon">💾</span>
              <span className="download-button__text">Скачать JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Карточки выбора класса */}
      <div className="class-cards">
        <div className="class-cards__container">
          {classCards.map((classCard) => (
            <div
              key={classCard.id}
              className={`class-card ${selectedClass === classCard.id ? 'class-card--active' : ''}`}
              data-class={classCard.id}
              onClick={() => setSelectedClass(classCard.id)}
              style={{
                borderColor: selectedClass === classCard.id ? classCard.color : (classCard.id === 'Все' ? '#c5d9f1' : 'transparent'),
                backgroundColor: selectedClass === classCard.id ? `${classCard.color}10` : (classCard.id === 'Все' ? 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)' : '#ffffff')
              }}
            >
              <div 
                className="class-card__indicator"
                style={{ backgroundColor: classCard.color }}
              ></div>
              <span className="class-card__label">{classCard.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Выбор временного диапазона */}
      <div className="time-range-selector">
        <div className="time-range-selector__container">
          <div className="time-range-selector__label">
            <span>Временной диапазон:</span>
          </div>
          <div className="time-range-selector__options">
            {timeRangeOptions.map((option) => (
              <label key={option.id} className="time-range-option">
                <input
                  type="radio"
                  name="time-range-testing"
                  value={option.id}
                  checked={selectedTimeRange === option.id}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                />
                <span className="time-range-option__label">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Кастомный выбор дат */}
        {selectedTimeRange === 'custom' && (
          <div className="custom-date-range">
            <div className="custom-date-range__container">
              <div className="custom-date-range__field">
                <label className="custom-date-range__label">От:</label>
                <input
                  type="date"
                  className="custom-date-range__input"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                />
              </div>
              <div className="custom-date-range__field">
                <label className="custom-date-range__label">До:</label>
                <input
                  type="date"
                  className="custom-date-range__input"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Дашборд с графиками */}
      <div className="dashboard">
        {/* Карточка статистики по отзывам */}
        <div className="card card--large">
          <div className="card__header">
            <h3 className="card__title">
              {selectedClass === 'Все' 
                ? 'Результаты тестирования - Общая статистика' 
                : `Результаты тестирования - ${selectedClass}`}
            </h3>
          </div>
          
          <div className="card__filters">
            <label className="filter-radio">
              <input 
                type="radio" 
                name="testing-filter"
                value="total"
                checked={selectedFilter === 'total'}
                onChange={(e) => setSelectedFilter(e.target.value)}
              />
              <span className="filter-radio__label">Общее количество тестов</span>
            </label>
            
            <label className="filter-radio">
              <input 
                type="radio" 
                name="testing-filter"
                value="processed"
                checked={selectedFilter === 'processed'}
                onChange={(e) => setSelectedFilter(e.target.value)}
              />
              <span className="filter-radio__label">Успешные тесты</span>
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
                  formatter={(value) => [`${value} ${selectedFilter === 'total' ? 'тестов' : 'успешных'}`, 'Количество']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={classCards.find(c => c.id === selectedClass)?.color || '#2b61ec'} 
                  strokeWidth={3}
                  dot={{ fill: classCards.find(c => c.id === selectedClass)?.color || '#2b61ec', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: classCards.find(c => c.id === selectedClass)?.color || '#2b61ec', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Карточка распределения результатов тестирования */}
        <div className="card card--small">
          <div className="card__header">
            <h3 className="card__title">
              {selectedClass === 'Все' 
                ? 'Распределение результатов - Общая статистика' 
                : `Распределение результатов для: ${selectedClass}`}
            </h3>
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
    </>
  )

  return (
    <div className="app">
      {/* Бургер-кнопка для мобильных устройств */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`burger-line ${isMobileMenuOpen ? 'burger-line--active' : ''}`}></span>
        <span className={`burger-line ${isMobileMenuOpen ? 'burger-line--active' : ''}`}></span>
        <span className={`burger-line ${isMobileMenuOpen ? 'burger-line--active' : ''}`}></span>
      </button>

      {/* Левое меню */}
      <nav className={`sidebar ${isMobileMenuOpen ? 'sidebar--mobile-open' : ''}`}>
        <div className="sidebar__header">
          <h2 className="sidebar__title">Меню</h2>
          <button 
            className="sidebar__close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <div className="sidebar__menu">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              className={`sidebar__item ${activeMenuItem === item ? 'sidebar__item--active' : ''}`}
              onClick={() => {
                setActiveMenuItem(item)
                setIsMobileMenuOpen(false) // Закрываем меню при выборе пункта
              }}
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

      {/* Оверлей для мобильного меню */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Основной контент */}
      <main className="main">
        {activeMenuItem === 'Главная' && renderDashboardContent('Дашборд')}
        {activeMenuItem === 'Кластеризация' && renderClusteringPage()}
        {activeMenuItem === 'Тестирование' && renderTestingPage()}
        {activeMenuItem === 'Документация' && (
          <div className="main__header">
            <h1 className="main__title">Документация</h1>
            <p>Страница в разработке...</p>
          </div>
        )}
        {activeMenuItem === 'Логи' && (
          <div className="main__header">
            <h1 className="main__title">Логи</h1>
            <p>Страница в разработке...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App