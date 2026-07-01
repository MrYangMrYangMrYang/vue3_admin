/**
 * @fileoverview 主题 & 国际化 E2E 测试
 * @description 验证暗色模式切换、中英文语言切换
 */
import { test, expect } from '@playwright/test'

test.describe('Theme & Locale', () => {
  test.beforeEach(async ({ page }) => {
    // 先登录
    await page.goto('/login')
    await page.getByPlaceholder('输入您的用户名').fill('admin')
    await page.getByPlaceholder('输入您的密码').fill('123456')
    await page.getByRole('button', { name: '登录' }).click()
    await page.waitForURL(/\/article\/channel/)
  })

  test('should toggle dark mode', async ({ page }) => {
    const html = page.locator('html')

    // 初始状态应为亮色模式
    await expect(html).not.toHaveClass(/dark/)

    // 点击主题切换按钮
    await page.locator('.icon-btn').nth(1).click()
    await expect(html).toHaveClass(/dark/)

    // 再次点击切换回亮色
    await page.locator('.icon-btn').nth(1).click()
    await expect(html).not.toHaveClass(/dark/)
  })

  test('should switch language to English', async ({ page }) => {
    // 点击语言切换按钮
    await page.locator('.icon-btn').first().click()
    await page.getByText('English').click()

    // 菜单应切换为英文
    await expect(page.getByText('Articles')).toBeVisible()
    await expect(page.getByText('Categories')).toBeVisible()
  })

  test('should switch language back to Chinese', async ({ page }) => {
    // 先切换到英文
    await page.locator('.icon-btn').first().click()
    await page.getByText('English').click()

    // 再切回中文
    await page.locator('.icon-btn').first().click()
    await page.getByText('中文').click()

    // 菜单应切换回中文
    await expect(page.getByText('文章管理')).toBeVisible()
    await expect(page.getByText('文章分类')).toBeVisible()
  })

  test('should persist theme preference across page reload', async ({
    page
  }) => {
    // 切换到暗色模式
    await page.locator('.icon-btn').nth(1).click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    // 刷新页面
    await page.reload()
    await page.waitForURL(/\/article\/channel/)

    // 主题应保持暗色模式
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('should persist locale preference across page reload', async ({
    page
  }) => {
    // 切换到英文
    await page.locator('.icon-btn').first().click()
    await page.getByText('English').click()

    // 刷新页面
    await page.reload()
    await page.waitForURL(/\/article\/channel/)

    // 菜单应保持英文
    await expect(page.getByText('Articles')).toBeVisible()
  })
})
