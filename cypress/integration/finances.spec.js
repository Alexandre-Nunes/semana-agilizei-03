/// <reference types="cypress" />

import { format, prepareLocalStorage } from '../support/utils'

context('Dev Finances Agilizei', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        })
    });
    it('Cadastrar entradas', () => {
        cy.get('#transaction > .button').click()
        cy.get('#description').type('Vale')
        cy.get('#amount').type(500)
        cy.get('#date').type('2021-03-20')
        cy.get('button').click()
        cy.get('#data-table tbody tr').should('have.length', 3)
        cy.get('#data-table tbody tr .description').should('contain', 'Vale')
        cy.get('#data-table tbody tr .income').should('contain', '500,00')
        cy.get('#data-table tbody tr .date').should('contain', '20/03/2021')
    });
    it('Cadastrar saídas', () => {
        cy.get('#transaction > .button').click()
        cy.get('#description').type('Mercado')
        cy.get('#amount').type(-350)
        cy.get('#date').type('2021-03-22')
        cy.get('button').click()
        cy.get('#data-table tbody tr').should('have.length', 3)
        cy.get('#data-table tbody tr .description').should('contain', 'Mercado')
       
    });
    it('Remover entradas e saídas', () => {
        cy.get('#transaction > .button').click()
        cy.get('#description').type('Salário')
        cy.get('#amount').type(2000)
        cy.get('#date').type('2021-03-05')
        cy.get('button').click()
        cy.get('#data-table tbody tr').should('have.length', 3)
        cy.get('#data-table tbody tr .description').should('contain', 'Salário')
        cy.get('#data-table tbody tr .income').should('contain', '2.000,00')
        cy.get('#data-table tbody tr .date').should('contain', '05/03/2021')

        cy.get('#transaction > .button').click()
        cy.get('#description').type('Posto')
        cy.get('#amount').type(-50)
        cy.get('#date').type('2021-03-22')
        cy.get('button').click()
        cy.get('#data-table tbody tr').should('have.length', 4)
        cy.get('#data-table tbody tr .description').should('contain', 'Posto')
        cy.get('[data-index="1"] > :nth-child(4) > img').click()
        cy.get('#data-table tbody tr').should('have.length', 3)
    });


    it('Validar saldo pelo local storage', () => {
        
        let entradas = 0
        let saidas = 0

        cy.get('#data-table tbody tr')
          .each(($el, index, $list) => {
            cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
              if(text.includes('-')){
                saidas = saidas + format(text)  
              } else{
                entradas = entradas + format(text)  
              }   
                // cy.log(`entradas`, entradas)
                // cy.log(`saidas`, saidas)

            })
        })

        cy.get('#totalDisplay').invoke('text').then(text => {
            //cy.log(`valor total`, format(text))

            let totalFormatado = format(text)
            let total = entradas + saidas
            //cy.log(total)

            expect(totalFormatado).to.be.eq(total)
        })
    })
})