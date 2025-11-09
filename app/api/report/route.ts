import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reportedUserId, reason, description } = await req.json()

    if (!reportedUserId || !reason) {
      return NextResponse.json(
        { error: 'Reported user ID and reason are required' },
        { status: 400 }
      )
    }

    if (reportedUserId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot report yourself' },
        { status: 400 }
      )
    }

    // Check if user is banned
    const reporter = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isBanned: true },
    })

    if (reporter?.isBanned) {
      return NextResponse.json(
        { error: 'Your account has been banned' },
        { status: 403 }
      )
    }

    // Create report
    await prisma.report.create({
      data: {
        reportedById: session.user.id,
        reportedUserId,
        reason,
        description: description || undefined,
      },
    })

    // Check if user has multiple reports and auto-ban if threshold is met
    const reportCount = await prisma.report.count({
      where: {
        reportedUserId,
        status: 'pending',
      },
    })

    // Auto-ban if user has 5+ pending reports (adjust threshold as needed)
    if (reportCount >= 5) {
      await prisma.user.update({
        where: { id: reportedUserId },
        data: {
          isBanned: true,
          banReason: 'Multiple reports received',
          bannedAt: new Date(),
        },
      })

      // Mark all pending reports as reviewed
      await prisma.report.updateMany({
        where: {
          reportedUserId,
          status: 'pending',
        },
        data: {
          status: 'reviewed',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

