/**
 * @fileoverview 导航与布局 E2E 测试
 * @description 验证侧边栏导航、面包屑、404 页面等
 */
import { test, expect } from '@playwright/test'

test.describe('Navigation & Layout', () => {
  test.beforeEach(async ({ page }) => {
    // 先登录
    await page.goto('/login')
    await page.getByPlaceholder('输入您的用户名').fill('admin')
    await page.getByPlaceholder('输入您的密码').fill('123456')
    await page.getByRole('button', { name: '登录' }).click()
    await page.waitForURL(/\/article\/channel/)
  })

  test('should navigate between menu items', async ({ page }) => {
    // 从分类页 → 文章管理
    await page.getByText('文章管理').click()
    await expect(page).toHaveURL(/\/article\/manage/)
    await expect(page.locator('.page-container')).toBeVisible()

    // → 基本资料
    await page.locator('.el-sub-menu__title').getByText('个人中心').click()
    await page.getByText('基本资料').click()
    await expect(page).toHaveURL(/\/user\/profile/)
  })

  test('should show breadcrumb navigation', async ({ page }) => {
    await page.getByText('文章管理').click()
    await expect(page.locator('.breadcrumb-bar')).toBeVisible()
  })

  test('should toggle sidebar collapse', async ({ page }) => {
    const aside = page.locator('.el-aside')
    const initialWidth = await aside.boundingBox()

    // 点击折叠按钮
    await page.locator('.collapse-btn').click()
    const collapsedWidth = await aside.boundingBox()

    expect(collapsedWidth!.width).toBeLessThan(initialWidth!.width)
  })

  test('should show 404 page for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await expect(page.getByText('页面走丢了')).toBeVisible()
    await page.getByRole('button', { name: '返回首页' }).click()
    await expect(page).toHaveURL(/\/article\/channel/)
  })

  test('should logout and redirect to login', async ({ page }) => {
    // 点击用户头像下拉菜单
    await page.locator('.el-dropdown__box').click()
    await page.getByText('退出登录').click()

    // 确认退出弹窗
    await page.getByRole('button', { name: '确认' }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})
