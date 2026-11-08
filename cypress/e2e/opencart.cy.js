/**
 * Separate suite for https://demo.opencart.cn/
 * (math.cy.js keeps using baseUrl = suninjuly.github.io)
 *
 * 1) Navigation across project pages
 * 2) New user registration
 * 3) Extra feature: Contact Us enquiry form
 */

const BASE = 'https://demo.opencart.cn'
const LANG = 'language=en-gb'

const pages = [
  { name: 'Home', path: `/index.php?route=common/home&${LANG}`, heading: null },
  { name: 'Desktops', path: `/index.php?route=product/category&${LANG}&path=20`, heading: 'Desktops' },
  { name: 'Laptops & Notebooks', path: `/index.php?route=product/category&${LANG}&path=18`, heading: 'Laptops & Notebooks' },
  { name: 'Components', path: `/index.php?route=product/category&${LANG}&path=25`, heading: 'Components' },
  { name: 'Tablets', path: `/index.php?route=product/category&${LANG}&path=57`, heading: 'Tablets' },
  { name: 'Software', path: `/index.php?route=product/category&${LANG}&path=17`, heading: 'Software' },
  { name: 'Phones & PDAs', path: `/index.php?route=product/category&${LANG}&path=24`, heading: 'Phones & PDAs' },
  { name: 'Cameras', path: `/index.php?route=product/category&${LANG}&path=33`, heading: 'Cameras' },
  { name: 'MP3 Players', path: `/index.php?route=product/category&${LANG}&path=34`, heading: 'MP3 Players' },
  { name: 'About Us', path: `/index.php?route=information/information&${LANG}&information_id=1`, heading: 'About Us' },
  { name: 'Terms & Conditions', path: `/index.php?route=information/information&${LANG}&information_id=2`, heading: 'Terms & Conditions' },
  { name: 'Privacy Policy', path: `/index.php?route=information/information&${LANG}&information_id=3`, heading: 'Privacy Policy' },
  { name: 'Delivery Information', path: `/index.php?route=information/information&${LANG}&information_id=4`, heading: 'Delivery Information' },
  { name: 'Contact Us', path: `/index.php?route=information/contact&${LANG}`, heading: 'Contact Us' },
  { name: 'Site Map', path: `/index.php?route=information/sitemap&${LANG}`, heading: 'Site Map' },
  { name: 'Brands', path: `/index.php?route=product/manufacturer&${LANG}`, heading: 'Find Your Favorite Brand' },
  { name: 'Specials', path: `/index.php?route=product/special&${LANG}`, heading: 'Special Offers' },
  { name: 'Gift Certificates', path: `/index.php?route=checkout/voucher&${LANG}`, heading: 'Purchase a Gift Certificate' },
  { name: 'Shopping Cart', path: `/index.php?route=checkout/cart&${LANG}`, heading: 'Shopping Cart' },
  { name: 'Login', path: `/index.php?route=account/login&${LANG}`, heading: 'Returning Customer' },
  { name: 'Register', path: `/index.php?route=account/register&${LANG}`, heading: 'Register Account' },
]

describe('OpenCart demo — page navigation', () => {
  pages.forEach(({ name, path, heading }) => {
    it(`opens ${name}`, () => {
      cy.visit(`${BASE}${path}`)
      cy.get('#content').should('be.visible')
      cy.url().should('include', 'demo.opencart.cn')

      if (heading) {
        cy.contains('h1, h2, legend', heading).should('be.visible')
      }
    })
  })
})

describe('OpenCart demo — user registration', () => {
  it('registers a new customer with unique email', () => {
    const stamp = Date.now()
    const user = {
      firstName: 'Student',
      lastName: 'Tester',
      email: `student.cypress.${stamp}@example.com`,
      password: 'TestPass123!',
    }

    cy.visit(`${BASE}/index.php?route=account/register&${LANG}`)
    cy.contains('h1', 'Register Account').should('be.visible')

    cy.get('#input-firstname').clear().type(user.firstName)
    cy.get('#input-lastname').clear().type(user.lastName)
    cy.get('#input-email').clear().type(user.email)
    cy.get('#input-password').clear().type(user.password)

    // Privacy Policy agreement (Bootstrap form-switch)
    cy.get('input[name="agree"]').check({ force: true })

    cy.get('#form-register button[type="submit"]').click()

    cy.url({ timeout: 30000 }).should('include', 'route=account/success')
    cy.contains('h1', 'Your Account Has Been Created!').should('be.visible')
    cy.get('#content').should(
      'contain.text',
      'Congratulations! Your new account has been successfully created!'
    )

    cy.task('log', `Registered user: ${user.email}`)
  })
})

describe('OpenCart demo — Contact Us (student choice)', () => {
  it('submits an enquiry through the contact form', () => {
    const stamp = Date.now()

    cy.visit(`${BASE}/index.php?route=information/contact&${LANG}`)
    cy.contains('h1', 'Contact Us').should('be.visible')

    cy.get('#input-name').clear().type('Cypress Student')
    cy.get('#input-email').clear().type(`contact.${stamp}@example.com`)
    cy.get('#input-enquiry')
      .clear()
      .type('Hello, this is an automated enquiry from a Cypress lab test.')

    cy.get('#form-contact button[type="submit"]').click()

    // OpenCart 4 posts via AJAX and redirects to the success page
    cy.url({ timeout: 30000 }).should('include', 'route=information/contact')
    cy.get('#content', { timeout: 30000 }).should(
      'contain.text',
      'Your enquiry has been successfully sent to the store owner!'
    )
  })
})
