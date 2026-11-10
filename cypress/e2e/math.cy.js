function calc(x) {
  return `${Math.log(Math.abs(12 * Math.sin(Number(x))))}`
}

describe('Robot power — math.html', () => {
  it('reads current x, computes answer, fills form and submits', () => {
    cy.visit('/math.html')

    cy.get('#input_value')
      .should('be.visible')
      .invoke('text')
      .then((rawX) => {
        const x = rawX.trim()
        expect(x, 'x must be present on the page').to.match(/^\d+$/)

        const answer = calc(x)
        cy.task('log', `x = ${x}, answer = ln(|12 * sin(${x})|) = ${answer}`)

        cy.get('#answer').clear().type(answer)
      })

    cy.get('#robotCheckbox').check()
    cy.get('#robotsRule').check()
    cy.window().then((win) => cy.stub(win, 'getHashcode').returns(1))
    cy.get('button[type="submit"]').should('not.be.disabled').click()
  })
})
