export const DEMO_MODE_ENABLED = () => {
    return localStorage.getItem('mica_demo_mode') === 'true';
};

export const DEMO_CAMPAIGN = {
    // Campaign Details
    id: "demo-campaign-001",
    user_id: "demo-user",
    product_name: "7-Day Mindfulness Challenge",
    product_description: "A transformative 7-day online program designed for busy professionals in India who want to reduce stress, improve focus, and build a sustainable mindfulness practice. Led by certified instructor Priya Sharma, this course combines guided meditations, breathing exercises, journaling prompts, and community support. Participants receive daily video lessons (15 min each), a companion workbook, lifetime access to recordings, and entry to a private WhatsApp community of like-minded practitioners.",
    target_audience: "Working professionals aged 25-45 in Indian metros (Mumbai, Delhi, Bangalore, Pune) who experience daily stress, are curious about mindfulness but haven't committed to a practice, and prefer structured programs over self-guided learning.",
    launch_date: "2026-03-01",
    budget: 15000,
    location: "India — Metro cities",
    tone: "Warm & Inspirational",
    tone_custom_words: "", // Added to satisfy TypeScript interface
    status: "plan_ready",
    recommended_channels: ["email", "whatsapp", "instagram"],
    recipient_count: 247,
    launched_at: "2026-03-01T09:00:00Z",
    campaign_start_date: "2026-03-01",
    campaign_end_date: "2026-03-28",

    // Tone Preview (already approved)
    tone_preview_content: {
        tone_summary: "Your campaign speaks with the warmth of a trusted friend who genuinely wants the best for your audience. We use gentle encouragement, relatable stories about everyday stress, and inspiring language that makes mindfulness feel accessible — not intimidating. Every message feels like a personal invitation, not a sales pitch.",
        sample_email: {
            subject: "Your calmer mornings start here ☀️",
            opening_paragraph: "Hi there! You know that feeling when you wake up and your mind is already racing through the day's to-do list? What if tomorrow morning could feel different? The 7-Day Mindfulness Challenge is designed specifically for people like you — busy professionals who know they need a pause button but haven't found the right one yet. In just 15 minutes a day, you'll discover that peace isn't something you find. It's something you practice."
        },
        sample_social_post: {
            caption: "That moment when your alarm goes off and your mind is already racing... 🏃‍♀️💨\n\nWhat if tomorrow morning could feel completely different?\n\nThe 7-Day Mindfulness Challenge is designed for busy professionals who know they need a pause button — but haven't found the right one yet.\n\n15 minutes a day. That's it.\n\nNo complicated poses. No spiritual jargon. Just practical techniques that fit into your real life.\n\nJoin 247 professionals who are choosing calmer mornings. Link in bio. 🧘‍♀️\n\n#MindfulnessChallenge #StressRelief #MindfulLiving #WellnessJourney #IndianWellness #MindfulIndia #MorningRoutine #MentalHealth",
            post_type: "carousel"
        },
        sample_whatsapp: {
            message: "Hey! 😊 Quick question — how did your morning start today? Rushed and stressful, or calm and intentional? If it was the first one, you're not alone. That's exactly why we created the 7-Day Mindfulness Challenge. 15 minutes a day to completely transform how you start your mornings. Interested? Reply YES and I'll send you the details!"
        },
        recommended_channels: ["email", "whatsapp", "instagram"],
        channel_reasoning: "Based on the target audience of busy professionals and a ₹15,000 budget, we've selected a high-touch, mobile-first mix. Instagram will drive visual awareness and initial curiosity. WhatsApp provides the personal connection needed for a high-trust product like mindfulness. Email allows for detailed storytelling and delivering value (content) before asking for the sale."
    },

    // Marketing Plan
    marketing_plan: {
        campaign_name: "Mindful Mornings — 7-Day Transformation",
        strategy_summary: "This 4-week campaign takes your audience on a journey from curiosity to commitment. Week 1 plants the seed by highlighting the universal pain of morning stress. Week 2 builds trust through free value and testimonials. Week 3 creates urgency with limited spots and early-bird pricing. Week 4 drives final conversions with countdown messaging and social proof.\n\nThe multi-channel approach ensures your message reaches people where they already spend time — email for detailed content, WhatsApp for personal connection, and Instagram for visual inspiration. Each channel reinforces the others, creating a surround-sound effect that keeps the Mindfulness Challenge top-of-mind.",
        target_persona: "Meet Aarav, 32, a software developer in Bangalore. He works 10-hour days, scrolls his phone until midnight, and wakes up exhausted. He's tried meditation apps but never stuck with them past day 2. He needs something structured, community-driven, and designed for someone who doesn't have time to 'find themselves.' He has ₹2,000 to spend on self-improvement this month and trusts recommendations from WhatsApp groups more than Instagram ads.",
        weekly_plan: [
            {
                week: 1,
                theme: "Awareness & Curiosity",
                goal: "Make the audience recognize their need for mindfulness",
                tactics: [
                    { day: 1, channel: "email", action: "Send welcome email — 'Your calmer mornings start here'" },
                    { day: 1, channel: "whatsapp", action: "Send personal intro message — 'How did your morning start?'" },
                    { day: 2, channel: "instagram", action: "Post carousel — '5 Signs You Need a Mindfulness Reset'" },
                    { day: 3, channel: "instagram", action: "Post reel — 'Morning routine: stressed vs. mindful'" },
                    { day: 5, channel: "email", action: "Send value email — 'The 2-Minute Breathing Hack'" },
                    { day: 5, channel: "whatsapp", action: "Send free resource — 'Try this tonight before bed'" },
                    { day: 7, channel: "instagram", action: "Post testimonial carousel — 'What past participants say'" }
                ]
            },
            {
                week: 2,
                theme: "Trust & Value",
                goal: "Position the course as the solution through free value and social proof",
                tactics: [
                    { day: 8, channel: "instagram", action: "Post behind-the-scenes — 'Meet your instructor Priya'" },
                    { day: 10, channel: "whatsapp", action: "Send mini-lesson — '3-minute desk meditation'" },
                    { day: 10, channel: "instagram", action: "Post infographic — 'What mindfulness does to your brain'" },
                    { day: 12, channel: "email", action: "Send social proof email — 'How Aarav went from 4hrs to 7hrs sleep'" },
                    { day: 14, channel: "instagram", action: "Post countdown — '2 weeks until launch!'" },
                    { day: 14, channel: "whatsapp", action: "Send exclusive preview — 'Sneak peek: Day 1 of the challenge'" }
                ]
            },
            {
                week: 3,
                theme: "Urgency & FOMO",
                goal: "Create urgency with limited spots and early-bird pricing",
                tactics: [
                    { day: 15, channel: "whatsapp", action: "Send urgency message — 'Only 50 early-bird spots left'" },
                    { day: 16, channel: "instagram", action: "Post enrollment counter — 'X spots claimed'" },
                    { day: 18, channel: "instagram", action: "Post participant story — 'From skeptic to believer'" },
                    { day: 20, channel: "email", action: "Send urgency email — 'Early-bird pricing ends in 5 days'" },
                    { day: 20, channel: "whatsapp", action: "Send FOMO message — 'Your colleagues are already joining'" },
                    { day: 21, channel: "instagram", action: "Post community screenshot — 'Look who's joining'" }
                ]
            },
            {
                week: 4,
                theme: "Conversion & Close",
                goal: "Drive final signups with countdown and last-chance messaging",
                tactics: [
                    { day: 22, channel: "instagram", action: "Post 7-day countdown series starts" },
                    { day: 24, channel: "instagram", action: "Post FAQ carousel — 'Everything you need to know'" },
                    { day: 25, channel: "whatsapp", action: "Send reminder — '3 days left to join'" },
                    { day: 26, channel: "whatsapp", action: "Send personal note — 'I saved a spot for you'" },
                    { day: 27, channel: "email", action: "Send final email — 'Last chance: doors close tomorrow'" },
                    { day: 28, channel: "email", action: "Send closing email — 'Doors are closing tonight'" },
                    { day: 28, channel: "whatsapp", action: "Send final WhatsApp — 'This is it — join now or wait 3 months'" }
                ]
            }
        ],
        budget_allocation: { email: 15, whatsapp: 25, instagram: 50, voice_agent: 0, video_ad: 10 },
        expected_outcomes: { reach: "3,200+ touchpoints", engagement_rate: "12-18%", conversion_estimate: "40-60 enrollments" },
        executive_summary: "The 'Mindful Mornings' campaign is a 28-day, multi-channel marketing strategy designed to fill the 7-Day Mindfulness Challenge with 50+ paying participants. By combining the personal touch of WhatsApp messaging with the visual inspiration of Instagram content and the detailed storytelling of email, we create a comprehensive awareness-to-conversion funnel that meets potential participants exactly where they are.\n\nOur approach prioritizes authenticity and value-first marketing. Rather than hard-selling from day one, we spend the first two weeks building genuine connection through free resources, relatable stories, and social proof from past participants. This trust-building phase makes the conversion push in weeks 3-4 feel natural rather than pushy.\n\nWith a ₹15,000 budget allocated primarily toward Instagram content creation and WhatsApp engagement, this campaign is optimized for the Indian metro professional demographic that prefers mobile-first, community-driven experiences.",
        key_metrics: { total_touchpoints: 23, email_count: 5, whatsapp_count: 8, social_post_count: 10, campaign_duration_days: 28, estimated_reach: "3,200+" },
        recommendations: [
            "Consider adding a free webinar in Week 2 to boost trust and give potential participants a taste of Priya's teaching style",
            "Create a referral incentive — offer ₹200 off for each friend referred — to leverage WhatsApp sharing behavior",
            "Post Instagram Stories daily in addition to feed posts to maintain visibility in the algorithm"
        ]
    },

    // Email Templates (5)
    email_templates: [
        {
            id: "demo-email-1",
            template_order: 1,
            subject: "Your calmer mornings start here ☀️",
            pre_header: "What if tomorrow felt completely different?",
            body: "<p>Hi {{first_name}},</p><p>You know that feeling when your alarm goes off and your brain immediately starts racing? <em>The meeting at 10. The deadline at 3. The groceries you forgot. The gym you'll skip again.</em></p><p>What if tomorrow morning could feel completely different?</p><p>The <strong>7-Day Mindfulness Challenge</strong> is designed specifically for busy professionals like you — people who know they need a pause button but haven't found the right one yet.</p><p>In just 15 minutes a day, you'll learn:</p><ul><li>A morning breathing technique that replaces anxiety with clarity</li><li>A 'desk reset' practice for when work gets overwhelming</li><li>A bedtime routine that actually helps you sleep</li></ul><p>No complicated poses. No spiritual jargon. Just practical techniques that fit into your real life.</p><p><a href='{{cta_link}}' style='background-color:#10B981;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;'>Reserve Your Spot →</a></p><p>Starting March 1st. Limited to 100 participants for personal attention.</p><p>Warmly,<br/>Priya Sharma<br/>Certified Mindfulness Instructor</p>",
            cta_text: "Reserve Your Spot",
            scheduled_day: 1
        },
        {
            id: "demo-email-2",
            template_order: 2,
            subject: "Try this 2-minute hack tonight 🌙",
            pre_header: "A free technique from the Mindfulness Challenge",
            body: "<p>Hi {{first_name}},</p><p>Before I tell you about the challenge, I want to give you something useful right now.</p><p>Tonight, before you pick up your phone in bed, try this:</p><p><strong>The 4-7-8 Breathing Technique:</strong></p><ol><li>Breathe in through your nose for 4 seconds</li><li>Hold your breath for 7 seconds</li><li>Exhale slowly through your mouth for 8 seconds</li><li>Repeat 3 times</li></ol><p>That's it. 90 seconds. Most people notice a difference in sleep quality on the very first night.</p><p>This is just one of 21 techniques we cover in the 7-Day Mindfulness Challenge. Imagine what a full week of guided practice could do.</p><p><a href='{{cta_link}}' style='background-color:#10B981;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;'>See the Full 7-Day Curriculum →</a></p><p>Try it tonight. Let me know how it goes.</p><p>Warmly,<br/>Priya</p>",
            cta_text: "See the Full 7-Day Curriculum",
            scheduled_day: 5
        },
        {
            id: "demo-email-3",
            template_order: 3,
            subject: "How Aarav went from 4hrs to 7hrs of sleep",
            pre_header: "A real story from a past participant",
            body: "<p>Hi {{first_name}},</p><p>I want to share Aarav's story with you.</p><p>Aarav is a 32-year-old software developer in Bangalore. He was working 10-hour days, doom-scrolling until 1 AM, and surviving on 4 hours of broken sleep. He'd tried meditation apps — Headspace, Calm, YouTube videos — but never made it past day 2.</p><p><em>\"I thought mindfulness was for people who had time. I didn't have time.\"</em></p><p>Then he joined the 7-Day Mindfulness Challenge.</p><p><em>\"The first morning, I did the 15-minute session before my coffee. By day 3, I was actually looking forward to it. By day 7, I was sleeping 7 hours for the first time in years. It wasn't magic — it was just someone finally showing me HOW to do it properly.\"</em></p><p>Aarav isn't special. He's just someone who gave it 15 minutes a day for 7 days.</p><p><a href='{{cta_link}}' style='background-color:#10B981;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;'>Join Aarav and 200+ Others →</a></p><p>Warmly,<br/>Priya</p>",
            cta_text: "Join Aarav and 200+ Others",
            scheduled_day: 12
        },
        {
            id: "demo-email-4",
            template_order: 4,
            subject: "⏰ Early-bird pricing ends in 5 days",
            pre_header: "₹1,499 instead of ₹2,499 — but not for long",
            body: "<p>Hi {{first_name}},</p><p>Quick update: we've had 187 people join the 7-Day Mindfulness Challenge so far. The response has been incredible.</p><p>I'm writing because the <strong>early-bird price of ₹1,499</strong> (instead of ₹2,499) ends in 5 days.</p><p>Here's everything you get:</p><ul><li>7 daily guided video lessons (15 min each)</li><li>A companion workbook with journaling prompts</li><li>Lifetime access to all recordings</li><li>Private WhatsApp community of fellow practitioners</li><li>2 live Q&A sessions with me</li></ul><p>That's less than ₹215 per day for a practice that changes how you start every morning for the rest of your life.</p><p><a href='{{cta_link}}' style='background-color:#10B981;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;'>Lock In Early-Bird Price →</a></p><p>After March 24th, the price goes to ₹2,499. No exceptions.</p><p>Warmly,<br/>Priya</p>",
            cta_text: "Lock In Early-Bird Price",
            scheduled_day: 20
        },
        {
            id: "demo-email-5",
            template_order: 5,
            subject: "Doors close tonight at midnight 🚪",
            pre_header: "Your last chance to join the Mindfulness Challenge",
            body: "<p>Hi {{first_name}},</p><p>This is my last email about the 7-Day Mindfulness Challenge.</p><p>Enrollment closes tonight at midnight. 223 people have already joined. There are 27 spots remaining.</p><p>I know you've been thinking about it. I know life is busy. I know there's always a reason to wait.</p><p>But here's what I've learned from teaching 500+ students: <strong>there is no perfect time to start taking care of your mind.</strong> There's only the moment you decide to.</p><p>15 minutes a day. 7 days. That's all I'm asking for.</p><p>If it doesn't change anything, you've lost less time than you spend scrolling Instagram in a week.</p><p>If it does change something — and for 89% of our participants, it does — you'll wonder why you didn't start sooner.</p><p><a href='{{cta_link}}' style='background-color:#EF4444;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;font-size:16px;'>Join Before Midnight →</a></p><p>Wishing you calmer mornings,<br/>Priya</p>",
            cta_text: "Join Before Midnight",
            scheduled_day: 27
        }
    ],

    // WhatsApp Messages (8)
    whatsapp_messages: [
        { id: "demo-wa-1", message_order: 1, message_text: "Hey! 😊 Quick question — how did your morning start today? Rushed and stressful, or calm and intentional? If it was the first one, you're not alone. 78% of working professionals in India say their mornings feel chaotic. That's exactly why we created the 7-Day Mindfulness Challenge. 15 mins/day to completely transform your mornings. Interested? Reply YES for details!", message_type: "intro", scheduled_day: 1 },
        { id: "demo-wa-2", message_order: 2, message_text: "Here's a quick technique you can try RIGHT NOW 🧘‍♀️ Close your eyes. Breathe in for 4 counts. Hold for 4. Out for 4. Do this 5 times. That's box breathing — one of 21 techniques in the Mindfulness Challenge. Noticed a difference? Imagine what 7 days of this could do. Details: [link]", message_type: "value", scheduled_day: 5 },
        { id: "demo-wa-3", message_order: 3, message_text: "Remember Aarav? Software dev in Bangalore. Was sleeping 4 hours a night. After the 7-Day Challenge, he's at 7 hours and actually enjoying his mornings ☕ His exact words: 'I wish someone had shown me this 5 years ago.' The next batch starts March 1st. 67 spots left. Want in? [link]", message_type: "social_proof", scheduled_day: 10 },
        { id: "demo-wa-4", message_order: 4, message_text: "Sneak peek! 👀 Here's what Day 1 of the Mindfulness Challenge looks like: ✨ 5-min morning intention setting ✨ 10-min guided meditation (no experience needed) ✨ Journaling prompt for clarity This isn't woo-woo stuff. It's practical, science-backed techniques that actually fit into a busy day. Start March 1st → [link]", message_type: "nurture", scheduled_day: 14 },
        { id: "demo-wa-5", message_order: 5, message_text: "Update: 187 people have joined the Mindfulness Challenge! 🎉 Only 50 early-bird spots left at ₹1,499 (regular: ₹2,499). I'm sharing this with you first because early supporters matter. Don't miss out → [link]", message_type: "fomo", scheduled_day: 15 },
        { id: "demo-wa-6", message_order: 6, message_text: "Something interesting — 3 people from your company have already signed up for the Mindfulness Challenge 👀 (I can't tell you who, but trust me, you're in good company!) Early-bird price of ₹1,499 ends in 5 days. This is genuinely the best investment in yourself at this price → [link]", message_type: "urgency", scheduled_day: 20 },
        { id: "demo-wa-7", message_order: 7, message_text: "3 days left to join 🕐 I don't usually send reminders like this, but I genuinely think this could help you. 223 people are starting their mindfulness journey on March 1st. The private WhatsApp community alone is worth joining — imagine 200+ people holding each other accountable for 7 days. Last call at this price: [link]", message_type: "reminder", scheduled_day: 25 },
        { id: "demo-wa-8", message_order: 8, message_text: "This is it — doors close TONIGHT at midnight 🚪 27 spots remaining. After tonight, the next batch won't start for 3 months. I saved a spot for you. All you need to do is say yes. Join here → [link] See you on the inside! 🧘‍♀️ — Priya", message_type: "close", scheduled_day: 28 }
    ],

    // Social Posts (10) — captions only, images would be Replicate URLs
    social_posts: [
        { id: "demo-post-1", post_order: 1, caption: "That moment when your alarm goes off and your mind is already racing through the day's to-do list... 🏃‍♀️💨\n\nWhat if tomorrow morning could feel completely different?\n\nThe 7-Day Mindfulness Challenge is designed for busy professionals who need a pause button — but haven't found the right one yet.\n\n15 minutes a day. No complicated poses. No spiritual jargon.\n\nJust practical techniques that fit into your real life.\n\nLink in bio 🧘‍♀️\n\n#MindfulnessChallenge #StressRelief #MindfulLiving #WellnessJourney #MindfulIndia", hashtags: "#MindfulnessChallenge #StressRelief #MindfulLiving #WellnessJourney #MindfulIndia", scheduled_day: 2, image_suggestion: "Split image: left side shows chaotic morning (alarm, phone notifications, coffee spilling), right side shows peaceful morning (sunrise, calm person meditating, clean desk). Warm golden tones.", image_url: "/demo-assets/post-1.png" },
        { id: "demo-post-2", post_order: 2, caption: "5 signs you need a mindfulness reset 🚨\n\n1️⃣ You check your phone within 30 seconds of waking up\n2️⃣ You can't remember the last time you ate without scrolling\n3️⃣ Your jaw is clenched right now (check!)\n4️⃣ You feel guilty when you're NOT working\n5️⃣ Sleep takes forever because your brain won't shut up\n\nIf you nodded at 3 or more... the 7-Day Mindfulness Challenge was designed for you.\n\nStarts March 1st. Link in bio.\n\n#MindfulnessReset #BusyProfessional #StressManagement #MindfulLiving #SelfCare", hashtags: "#MindfulnessReset #BusyProfessional #StressManagement #MindfulLiving #SelfCare", scheduled_day: 3, image_suggestion: "Clean infographic style with 5 numbered items, each with a small icon. Dark background with white text and green accents. Professional but approachable design.", image_url: "/demo-assets/post-2.png" },
        { id: "demo-post-3", post_order: 3, caption: "POV: You before vs. after the Mindfulness Challenge 🫣➡️😌\n\nBefore:\n• Snooze button 4 times\n• Scroll doom content for 20 mins\n• Rush through morning routine\n• Arrive at work already exhausted\n\nAfter:\n• Wake up with intention\n• 15-min guided practice\n• Calm, focused start\n• Actually enjoy your morning coffee\n\nThis isn't fantasy. This is what our participants report after just 7 days.\n\nReady for your transformation? Link in bio.\n\n#BeforeAndAfter #MindfulMorning #TransformYourMornings #WellnessChallenge #MindfulIndia", hashtags: "#BeforeAndAfter #MindfulMorning #TransformYourMornings #WellnessChallenge #MindfulIndia", scheduled_day: 7, image_suggestion: "Before/after split. Left: dark, blue-toned, person stressed at desk with messy surroundings. Right: warm, golden-toned, same person peacefully meditating with organized space. Clean typography.", image_url: "/demo-assets/post-3.png" },
        { id: "demo-post-4", post_order: 4, caption: "Meet Priya Sharma — your guide for the next 7 days 🧘‍♀️\n\n• 8 years of mindfulness practice\n• Certified instructor (Mindfulness-Based Stress Reduction)\n• Former corporate burnout survivor\n• Has guided 500+ people through their mindfulness journey\n\n\"I don't teach mindfulness because I'm naturally calm. I teach it because I was the most stressed person in the room — and these techniques saved me.\"\n\nLearn from someone who gets it. March 1st.\n\n#MeetYourInstructor #MindfulnessTeacher #Authenticity #RealStories", hashtags: "#MeetYourInstructor #MindfulnessTeacher #Authenticity #RealStories", scheduled_day: 8, image_suggestion: "Professional but warm portrait-style image of a female instructor in a calm setting — seated comfortably with natural lighting. Plants and warm tones in background. Welcoming expression.", image_url: "/demo-assets/post-4.png" },
        { id: "demo-post-5", post_order: 5, caption: "Your brain on mindfulness 🧠✨\n\nAfter just 8 weeks of practice, research shows:\n\n📈 22% increase in focus and attention\n📈 32% reduction in anxiety symptoms\n📈 45% improvement in sleep quality\n📈 28% decrease in emotional reactivity\n\nSource: Harvard Medical School, 2023\n\nThe 7-Day Mindfulness Challenge gives you the foundation to start seeing these changes.\n\n15 minutes a day. Science-backed. No fluff.\n\nLink in bio for details.\n\n#MindfulnessBenefits #ScienceOfMindfulness #BrainHealth #MentalWellness", hashtags: "#MindfulnessBenefits #ScienceOfMindfulness #BrainHealth #MentalWellness", scheduled_day: 10, image_suggestion: "Clean infographic showing a brain illustration with labeled benefits radiating outward. Modern, professional design with green and indigo accents on dark background.", image_url: "/demo-assets/post-5.png" },
        { id: "demo-post-6", post_order: 6, caption: "\"I thought mindfulness was for people who had time. Turns out, it's for people who DON'T.\" — Aarav, Bangalore 💬\n\nAarav was sleeping 4 hours a night. Working 10-hour days. Surviving on coffee and stress.\n\nAfter the 7-Day Challenge, he sleeps 7 hours. Starts his day with intention. And actually enjoys his mornings.\n\nHis advice? \"Just give it 15 minutes. That's all.\"\n\n47 early-bird spots remaining at ₹1,499.\n\n#RealResults #TestimonialTuesday #MindfulnessWorks #TransformationStory", hashtags: "#RealResults #TestimonialTuesday #MindfulnessWorks #TransformationStory", scheduled_day: 14, image_suggestion: "Testimonial card design with quote marks, person silhouette or avatar, and the quote text. Professional layout. Stars or rating element. Warm colors.", image_url: "/demo-assets/post-6.png" },
        { id: "demo-post-7", post_order: 7, caption: "🔢 ENROLLMENT UPDATE\n\n187 / 250 spots filled\n\n63 spots remaining.\n\nEvery day I'm amazed by the community forming around this challenge. Teachers, developers, doctors, designers, entrepreneurs — all choosing to invest 15 minutes a day in their mental well-being.\n\nEarly-bird price: ₹1,499 (ends March 24)\nRegular price: ₹2,499\n\nDon't be the one who says \"I should have joined\" next month.\n\n#EnrollmentOpen #LimitedSpots #MindfulCommunity #JoinTheChallenge", hashtags: "#EnrollmentOpen #LimitedSpots #MindfulCommunity #JoinTheChallenge", scheduled_day: 16, image_suggestion: "Progress bar or counter graphic showing 187/250 filled. Bold numbers. Sense of urgency. Dark background with bright accent colors. Clean and modern.", image_url: "/demo-assets/post-7.png" },
        { id: "demo-post-8", post_order: 8, caption: "From skeptic to believer — Meera's story 🙏\n\n\"I signed up because my therapist suggested it. I was skeptical. Meditation? Me? The person who can't sit still for 2 minutes?\n\nBut the 7-Day Challenge was different. It wasn't about sitting still. It was about noticing. Noticing my breath. My thoughts. My patterns.\n\nBy day 4, I caught myself reacting to a stressful email and paused. Actually paused. For the first time in my life.\n\nThat pause changed everything.\"\n\nYour pause is waiting. Link in bio.\n\n#SkepticToBeliver #MindfulnesStory #RealPeople #MindfulnessJourney", hashtags: "#SkepticToBeliever #MindfulnessStory #RealPeople #MindfulnessJourney", scheduled_day: 18, image_suggestion: "Contemplative lifestyle image — person sitting by window with cup of tea, looking peaceful and reflective. Warm natural lighting. Cozy, authentic feel.", image_url: "/demo-assets/post-8.png" },
        { id: "demo-post-9", post_order: 9, caption: "Everything you need to know about the 7-Day Mindfulness Challenge 📋\n\nSave this post! 🔖\n\n🗓️ Starts: March 1st\n⏱️ Daily commitment: 15 minutes\n📱 Format: Video lessons + workbook + WhatsApp community\n💰 Early-bird: ₹1,499 (regular: ₹2,499)\n🎓 Instructor: Priya Sharma (8 years experience)\n📞 Live Q&A: 2 sessions included\n♾️ Access: Lifetime recordings\n\nFAQ:\n❓ Do I need experience? No!\n❓ What time? Whenever suits you\n❓ Can I do it on phone? Yes, 100%\n❓ Money-back guarantee? Yes, 7 days\n\nAll your questions answered. Link in bio.\n\n#FAQ #MindfulnessChallenge #AllYouNeedToKnow #WellnessInvestment", hashtags: "#FAQ #MindfulnessChallenge #AllYouNeedToKnow #WellnessInvestment", scheduled_day: 24, image_suggestion: "Clean FAQ/info card design. Multiple small sections with icons. Easy to scan. Professional layout like a course brochure. Green and white accents.", image_url: "/demo-assets/post-9.png" },
        { id: "demo-post-10", post_order: 10, caption: "⏰ FINAL HOURS\n\nDoors close TONIGHT at midnight.\n\n223 people are starting their mindfulness journey on March 1st.\n\n27 spots remaining.\n\nAfter tonight, the next batch won't start for 3 months.\n\nThis is your moment. Not next week. Not next month. Now.\n\n₹1,499 for 7 days that could change how you start every morning for the rest of your life.\n\nLink in bio. Last chance. 🧘‍♀️\n\n#LastChance #DoorsClosing #NowOrNever #MindfulnessChallenge #FinalCall", hashtags: "#LastChance #DoorsClosing #NowOrNever #MindfulnessChallenge #FinalCall", scheduled_day: 28, image_suggestion: "Bold countdown graphic — large numbers showing '27 spots left'. Urgent colors (red accent). Clock or timer element. Dark background with high contrast text.", image_url: "/demo-assets/post-10.png" }
    ],

    // Video
    // Video
    video_url: "https://dynamic.heygen.ai/aws_pacific/avatar_tmp/1438b17eeed545b981fec8863f8d729d/v5848aa759798480c82ced7c4de123d30/820d52f6f343458792ddf22cfc4ed77e.mp4",
    video_status: "ready", // Set to ready so it displays
    video_script: "Hi there! I'm so excited to share your Mindful Mornings campaign strategy with you. Over the next 28 days, we're going to take your audience on a journey from curiosity to commitment, using email, WhatsApp, and Instagram to reach them where they already spend their time. In Week 1, we build awareness by sharing relatable content about morning stress. Week 2, we earn their trust with free value and real stories. Week 3, we create urgency with limited spots and early-bird pricing. And in Week 4, we drive the final conversions with countdown messaging. Your 247 contacts will receive 23 personalized touchpoints across all three channels. By the end, you can expect 40 to 60 enrollments. Let's make this happen!",

    // Execution Schedule (simulated progress)
    execution_schedule: [
        { id: "sched-1", channel: "email", asset_type: "email_template", asset_id: "demo-email-1", scheduled_day: 1, scheduled_date: "2026-03-01", status: "scheduled", recipients_total: 247, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-2", channel: "whatsapp", asset_type: "whatsapp_message", asset_id: "demo-wa-1", scheduled_day: 1, scheduled_date: "2026-03-01", status: "scheduled", recipients_total: 247, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-3", channel: "instagram", asset_type: "social_post", asset_id: "demo-post-1", scheduled_day: 2, scheduled_date: "2026-03-02", status: "scheduled", recipients_total: 1, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-4", channel: "instagram", asset_type: "social_post", asset_id: "demo-post-2", scheduled_day: 3, scheduled_date: "2026-03-03", status: "scheduled", recipients_total: 1, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-5", channel: "email", asset_type: "email_template", asset_id: "demo-email-2", scheduled_day: 5, scheduled_date: "2026-03-05", status: "scheduled", recipients_total: 247, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-6", channel: "whatsapp", asset_type: "whatsapp_message", asset_id: "demo-wa-2", scheduled_day: 5, scheduled_date: "2026-03-05", status: "scheduled", recipients_total: 247, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-7", channel: "instagram", asset_type: "social_post", asset_id: "demo-post-3", scheduled_day: 7, scheduled_date: "2026-03-07", status: "scheduled", recipients_total: 1, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-8", channel: "email", asset_type: "email_template", asset_id: "demo-email-3", scheduled_day: 12, scheduled_date: "2026-03-12", status: "scheduled", recipients_total: 247, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-9", channel: "instagram", asset_type: "social_post", asset_id: "demo-post-4", scheduled_day: 8, scheduled_date: "2026-03-08", status: "scheduled", recipients_total: 1, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-10", channel: "whatsapp", asset_type: "whatsapp_message", asset_id: "demo-wa-3", scheduled_day: 10, scheduled_date: "2026-03-10", status: "scheduled", recipients_total: 247, recipients_sent: 0, recipients_failed: 0 },
        // more scheduled items would go here to represent days 14-28
        { id: "sched-11", channel: "email", asset_type: "email_template", asset_id: "demo-email-4", scheduled_day: 20, scheduled_date: "2026-03-20", status: "scheduled", recipients_total: 247, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-12", channel: "whatsapp", asset_type: "whatsapp_message", asset_id: "demo-wa-4", scheduled_day: 14, scheduled_date: "2026-03-14", status: "scheduled", recipients_total: 247, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-13", channel: "instagram", asset_type: "social_post", asset_id: "demo-post-5", scheduled_day: 10, scheduled_date: "2026-03-10", status: "scheduled", recipients_total: 1, recipients_sent: 0, recipients_failed: 0 },
        { id: "sched-14", channel: "instagram", asset_type: "social_post", asset_id: "demo-post-6", scheduled_day: 14, scheduled_date: "2026-03-14", status: "scheduled", recipients_total: 1, recipients_sent: 0, recipients_failed: 0 }
    ],

    // Campaign Logs (sample entries for completed tasks)
    campaign_logs: [
        { channel: "email", action: "sent", recipient: "priya.sharma@gmail.com", status_details: "Delivered", executed_at: "2026-03-01T09:00:01Z" },
        { channel: "email", action: "sent", recipient: "aarav.dev@outlook.com", status_details: "Delivered", executed_at: "2026-03-01T09:00:02Z" },
        { channel: "email", action: "sent", recipient: "meera.wellness@yahoo.com", status_details: "Delivered", executed_at: "2026-03-01T09:00:03Z" },
        { channel: "whatsapp", action: "sent", recipient: "+91-98765-43210", status_details: "Delivered", executed_at: "2026-03-01T09:01:01Z" },
        { channel: "whatsapp", action: "failed", recipient: "+91-11111-00000", status_details: "Number not on WhatsApp", executed_at: "2026-03-01T09:01:15Z" }
    ]
};

export const DEMO_TONE_VARIANTS: any = {
    "Professional": {
        tone_summary: "A credible, authority-driven approach that positions the course as a career-enhancing tool. We focus on productivity, mental clarity, and evidence-based results. The language is direct, respectful, and value-oriented.",
        sample_email: {
            subject: "Strategies for sustainable high performance",
            opening_paragraph: "Dear {{first_name}}, In today's competitive landscape, mental clarity is as crucial as technical skill. Yet, 78% of professionals report improved focus after structured mindfulness training. The 7-Day Mindfulness Challenge offers a methodical approach to stress regulation and cognitive optimization."
        },
        sample_social_post: {
            caption: "Reviewing the data on workplace efficiency? 📊\n\nResearch indicates that brief mindfulness interventions can improve cognitive performance by 22%.\n\nThe 7-Day Mindfulness Challenge provides a structured framework to integrate these practices into your professional routine.\n\nOptimize your workday. Link in bio.\n\n#ProfessionalDevelopment #Leadership #Focus #Productivity",
            post_type: "single_image"
        },
        sample_whatsapp: {
            message: "Hello. We are launching a structured 7-day program designed to enhance professional focus and reduce workplace stress. It requires only 15 minutes daily. Would you be interested in reviewing the curriculum? Reply YES for the brochure."
        },
        recommended_channels: ["email", "linkedin", "whatsapp"],
        channel_reasoning: "Professional tone warrants a shift towards LinkedIn (simulated here via Instagram for demo) and formal Email. WhatsApp remains for direct utility but more formal."
    },
    "Urgent": {
        tone_summary: "A high-energy, scarcity-driven approach that emphasizes the cost of inaction. We use short sentences, time-sensitive triggers, and 'stop scrolling' language to break through inertia.",
        sample_email: {
            subject: "LAST CHANCE: Registration closes in 3 hours",
            opening_paragraph: "This is it. You have 3 hours left. Do not let another month go by wishing you had started. 220+ people are already in. Only 30 spots remain. If you want to change your mornings, you need to decide NOW."
        },
        sample_social_post: {
            caption: "STOP SCROLLING. 🛑\n\nThis is your final warning.\n\nDoors to the 7-Day Mindfulness Challenge close tonight.\n\nIf you miss this, you wait 3 months.\n\nDo you really want 90 more days of stress?\n\nDidn't think so.\n\nLINK IN BIO. GO. 🏃\n\n#LastChance #NowOrNever #Urgent #WellnessGoal",
            post_type: "reel_script"
        },
        sample_whatsapp: {
            message: "Quick update: Only 12 spots left! 🚨 Enrollment for the March batch closes definitively at midnight. If you were waiting for a sign, this is it. Don't miss out. Grab your spot here: [Link]"
        },
        recommended_channels: ["whatsapp", "instagram", "sms"],
        channel_reasoning: "Urgency works best on instant channels like WhatsApp and Instagram Stories. SMS added for immediate cutoff notifications."
    },
    "Casual": {
        tone_summary: "A relaxed, peer-to-peer vibe that feels like a chat with a best friend. We use emojis, lower-case styling, slang, and humor to make mindfulness feel fun and low-pressure.",
        sample_email: {
            subject: "stressed? same lol. let's fix it.",
            opening_paragraph: "hey friend! 👋 okay, be honest. how many times did you hit snooze today? no judgment, i hit it 4 times. but seriously, if you're tired of starting the day feeling like a exhausted pigeon, you gotta try this challenge."
        },
        sample_social_post: {
            caption: "me trying to meditate: 🧘‍♀️\nmy brain: \"did i turn off the stove? what if ducks had arms?\"\n\nwe get it. mindfulness is hard.\n\nthat's why we made the 7-Day Challenge super simple. no weird chanting. just vibes.\n\ncome hang! link in bio ✨\n\n#relatable #wellness #vibes #mindfulness",
            post_type: "meme"
        },
        sample_whatsapp: {
            message: "heyyy! 👋 doing a lil mindfulness challenge next week with some friends. wanna join? it's super chill, just 15 mins a day. promise it's not boring! lmk if you want the deets? ✨"
        },
        recommended_channels: ["instagram", "whatsapp", "tiktok"],
        channel_reasoning: "Casual tone lives on social. Instagram/TikTok (Reels) are primary. WhatsApp is very informal."
    },
    "Warm & Inspirational": DEMO_CAMPAIGN.tone_preview_content, // Fallback to default
    "Custom": {
        tone_summary: "A tailored approach based on your specific keywords. We blend the core mindfulness message with the specific nuances you requested, ensuring a unique voice that resonates with your niche audience.",
        sample_email: {
            subject: "A gentle invitation to clarity ✨",
            opening_paragraph: "Greetings. In the quiet moments of the morning, there is a space waiting for you. The 7-Day Mindfulness Challenge is an invitation to inhabit that space. To breathe. To be."
        },
        sample_social_post: {
            caption: "Breathe in. 🌿\n\nBreathe out.\n\nYour peace is a priority.\n\nJoin us for 7 days of returning to yourself.\n\nLink in bio.\n\n#Peace #Mindfulness #CustomTone #Serenity",
            post_type: "single_image"
        },
        sample_whatsapp: {
            message: "Hi there. 🌿 Just a gentle reminder that you deserve a moment of peace today. Our 7-Day Challenge starts soon. Would you like to join us on this journey? Reply YES to begin."
        },
        recommended_channels: ["email", "instagram"],
        channel_reasoning: "Custom tone usually implies a specific niche approach. Defaulting to high-visual (Instagram) and high-narrative (Email) channels."
    }
};
