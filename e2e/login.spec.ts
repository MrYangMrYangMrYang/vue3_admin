/**
 * @fileoverview 登录页 E2E 测试
 * @description 验证登录/注册表单、表单校验、模式切换等核心交互
 */
import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should render login form correctly', async ({ page }) => {
    // 验证表单关键元素存在
    await expect(page.locator('.formTitle')).toContainText('登录到工作台')
    await expect(page.getByPlaceholder('输入您的用户名')).toBeVisible()
    await expect(page.getByPlaceholder('输入您的密码')).toBeVisible()
    await expect(page.getByRole('button', { name: '登录' })).toBeVisible()
  })

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page.getByText('请输入用户名')).toBeVisible()
    await expect(page.getByText('请输入密码')).toBeVisible()
  })

  test('should switch to register mode and back', async ({ page }) => {
    // 切换到注册模式
    await page.getByText('立即注册').click()
    await expect(page.locator('.formTitle')).toContainText('创建新账号')
    // 确认密码字段应该出现
    await expect(page.getByPlaceholder('请再次输入密码')).toBeVisible()

    // 切回登录模式
    await page.getByText('立即登录').click()
    await expect(page.locator('.formTitle')).toContainText('登录到工作台')
  })

  test('should show forgot password dialog', async ({ page }) => {
    await page.getByText('忘记密码？').click()
    await expect(page.getByText('密码重置')).toBeVisible()
    await expect(page.getByText('admin@bigevent.com')).toBeVisible()
    await page.getByRole('button', { name: '我知道了' }).click()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.getByPlaceholder('输入您的用户名').fill('admin')
    await page.getByPlaceholder('输入您的密码').fill('123456')
    await page.getByRole('button', { name: '登录' }).click()

    // 登录成功后应跳转到文章分类页
    await expect(page).toHaveURL(/\/article\/channel/)
    await expect(page.locator('.layout-container')).toBeVisible()
  })
})
