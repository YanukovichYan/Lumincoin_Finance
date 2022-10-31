import config from "../../../config/config.js";

export class Main {

    constructor() {

        this.chartIncome = document.getElementById('chart-income').getContext('2d')
        this.chartExpense = document.getElementById('chart-expense').getContext('2d')

        this.showFilterBtn()
        this.incomeChartShow()
        this.expenseChartShow()
    }

    showFilterBtn() {

        let active = true;

        config.dataBtn.forEach((btn, index) => {
            const filterBtn = document.createElement('button')
            filterBtn.innerText = btn
            filterBtn.setAttribute('data-name', 'filter')
            filterBtn.className = 'btn btn-light border border-secondary me-3 px-3'

            if (active && index === 0) filterBtn.className = 'btn btn-secondary border border-secondary me-3 px-3'

            filterBtn.addEventListener('click', () => {
                active = false
                this.btnFilterClick = filterBtn
                this.dateInterval = ''

                let allFilterBtn = document.querySelectorAll('button[data-name="filter"]')
                allFilterBtn.forEach(el => {
                    el.className = 'btn btn-light border border-secondary me-3 px-3'
                })

                // this.btnFilterClick.classList.add() = 'btn btn-secondary border border-secondary me-3 px-3'
                this.btnFilterClick.classList.add('btn-secondary')
                this.btnFilterClick.classList.remove('btn-light')

                this.showOperationsWithFilter()

            })

            document.getElementById('btn-wrapper').appendChild(filterBtn)

        })
    }

    incomeChartShow() {
        new Chart(this.chartIncome, {
            type: 'pie',
            responsive: false,
            data: {
                labels: ["China", "India", "United States", "Indonesia", "Brazil"],
                datasets: [{
                    label: 'Population',
                    data: [1379302771, 1281935911, 326625791, 260580739, 207353391],
                    backgroundColor: [
                        '#DC3545',
                        '#20C997',
                        '#0D6EFD',
                        '#FFC107',
                        '#FD7E14',
                    ]
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    // legend: {
                    //     position: 'top',
                    // },
                    // title: {
                    //     display: true,
                    //     text: 'Доходы'
                    // }
                }
            },
        })


    }

    expenseChartShow() {
        new Chart(this.chartExpense, {
            type: 'pie',
            responsive: false,
            data: {
                labels: ["China", "India", "United States", "Indonesia", "Brazil"],
                datasets: [{
                    label: 'Population',
                    data: [1379302771, 1281935911, 326625791, 260580739, 207353391],
                    backgroundColor: [
                        '#DC3545',
                        '#20C997',
                        '#0D6EFD',
                        '#FFC107',
                        '#FD7E14',
                    ]
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    // legend: {
                    //     position: 'top',
                    // },
                    // title: {
                    //     display: true,
                    //     text: 'Доходы'
                    // }
                }
            },
        })


    }


}