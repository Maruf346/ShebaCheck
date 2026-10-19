import datetime
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.users.models import User
from apps.providers.models import ProviderProfile, ProviderService, PortfolioItem, AvailabilityBlock, FavoriteProvider
from apps.bookings.models import Booking
from apps.reviews.models import Review
from apps.support.models import Dispute


class Command(BaseCommand):
    help = "Seed the ShebaCheck database with verified providers, users, services, reviews, and bookings"

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")

        # 1. Admin user
        admin_user, _ = User.objects.get_or_create(
            email="admin@shebacheck.com",
            defaults={
                "first_name": "System",
                "last_name": "Admin",
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
            }
        )
        admin_user.set_password("Admin123!")
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.role = User.Role.ADMIN
        admin_user.save()
        self.stdout.write("  Admin user ready: admin@shebacheck.com / Admin123!")

        # 2. Customer user
        customer_user, _ = User.objects.get_or_create(
            email="customer@shebacheck.com",
            defaults={
                "first_name": "Fatima",
                "last_name": "Zaman",
                "phone": "01711223344",
                "role": User.Role.CUSTOMER,
            }
        )
        customer_user.set_password("Customer123!")
        customer_user.role = User.Role.CUSTOMER
        customer_user.save()
        self.stdout.write("  Customer user ready: customer@shebacheck.com / Customer123!")

        # Additional customer for reviews/bookings
        customer_two, _ = User.objects.get_or_create(
            email="tanvir.customer@shebacheck.com",
            defaults={
                "first_name": "Saif",
                "last_name": "Khan",
                "phone": "01799887766",
                "role": User.Role.CUSTOMER,
            }
        )
        customer_two.set_password("Customer123!")
        customer_two.save()

        # 3. Provider accounts and profiles
        providers_data = [
            {
                "email": "provider@shebacheck.com",
                "first_name": "Md. Rafiqul",
                "last_name": "Islam",
                "phone": "01811223344",
                "display_name": "Md. Rafiqul Islam",
                "category": "Electrical",
                "area": "Mirpur 10, Dhaka",
                "years_experience": 11,
                "starting_price": Decimal("500.00"),
                "cancellation_rate": Decimal("1.20"),
                "response_time": "Usually replies in 12 min",
                "image_url": "/images/providers/rafiqul-islam.jpg",
                "identity_verified": True,
                "bio": "An experienced electrical technician specializing in distribution boards, safe home wiring, and electrical diagnostics across Mirpur, Gulshan, and Banani.",
                "tags": ["NID checked", "11 years experience", "7-day service warranty", "Work history checked"],
                "services": [
                    ("Diagnostic Visit", Decimal("500.00"), "Complete electrical diagnostic check and circuit evaluation."),
                    ("Distribution Board Replacement", Decimal("1200.00"), "Safe installation and testing of main distribution breaker board."),
                    ("Switchboard Repair", Decimal("700.00"), "Repair and replacement of switches, sockets, and regulators."),
                    ("Ceiling Fan Installation", Decimal("600.00"), "Installation, balancing, and wiring of ceiling fans."),
                ],
                "portfolio": [
                    ("Distribution board replacement", "Completed breaker board replacement in Mirpur 10.", "/images/providers/rafiqul-islam.jpg"),
                    ("Apartment rewiring", "Complete rewiring and safety audit in Banani.", "/images/providers/rafiqul-islam.jpg"),
                    ("Electrical safety inspection", "Full safety check for residential flat in Gulshan 1.", "/images/providers/rafiqul-islam.jpg"),
                ]
            },
            {
                "email": "tanvir.ac@shebacheck.com",
                "first_name": "Tanvir",
                "last_name": "Hossain",
                "phone": "01822334455",
                "display_name": "Tanvir Hossain",
                "category": "AC Repair",
                "area": "Dhanmondi, Dhaka",
                "years_experience": 8,
                "starting_price": Decimal("850.00"),
                "cancellation_rate": Decimal("0.90"),
                "response_time": "Usually replies in 15 min",
                "image_url": "/images/providers/tanvir-hossain.jpg",
                "identity_verified": True,
                "bio": "Inverter AC diagnostics, pressure testing, jet cleaning, and seasonal maintenance for homes and offices in Dhanmondi, Gulshan, and Banani.",
                "tags": ["NID checked", "8 years experience", "Pressure testing specialist", "Work history checked"],
                "services": [
                    ("AC Master Service", Decimal("850.00"), "Full indoor and outdoor unit servicing with pressure wash."),
                    ("AC Jet Cleaning", Decimal("1200.00"), "High-pressure chemical jet cleaning to restore cooling efficiency."),
                    ("Cooling Diagnostics & Gas Check", Decimal("700.00"), "Refrigerant pressure diagnostics and leak check."),
                ],
                "portfolio": [
                    ("Office inverter AC service", "Servicing 4 inverter units in Gulshan 2 office.", "/images/providers/tanvir-hossain.jpg"),
                    ("AC jet wash", "Indoor deep foam and pressure wash in Dhanmondi 27.", "/images/providers/tanvir-hossain.jpg"),
                    ("Cooling performance tune-up", "Gas top-up and diagnostic in Banani.", "/images/providers/tanvir-hossain.jpg"),
                ]
            },
            {
                "email": "belal.plumbing@shebacheck.com",
                "first_name": "Belal",
                "last_name": "Ahmed",
                "phone": "01833445566",
                "display_name": "Belal Ahmed",
                "category": "Plumbing",
                "area": "Uttara Sector 7, Dhaka",
                "years_experience": 9,
                "starting_price": Decimal("400.00"),
                "cancellation_rate": Decimal("0.80"),
                "response_time": "Usually replies in 30 min",
                "image_url": "/images/providers/belal-ahmed.jpg",
                "identity_verified": True,
                "bio": "Sanitary installation, concealed leak detection, and water line repairs for apartments across Uttara and Mirpur.",
                "tags": ["NID checked", "9 years experience", "Leak detection", "Work history checked"],
                "services": [
                    ("Leakage Diagnostic", Decimal("400.00"), "Inspection of concealed pipes and joints with non-invasive test."),
                    ("Pipe & Fitting Repair", Decimal("650.00"), "Replacement of damaged CPVC/PPR pipes and valves."),
                    ("Basin & Commode Installation", Decimal("950.00"), "Professional sanitary ware fitting and water line connection."),
                ],
                "portfolio": [
                    ("Concealed pipe repair", "Emergency bathroom leak fix in Uttara Sector 3.", "/images/providers/belal-ahmed.jpg"),
                    ("Basin installation", "Ceramic basin and mixer tap setup in Uttara Sector 7.", "/images/providers/belal-ahmed.jpg"),
                ]
            },
            {
                "email": "sumon.appliance@shebacheck.com",
                "first_name": "Sumon",
                "last_name": "Mia",
                "phone": "01844556677",
                "display_name": "Sumon Mia",
                "category": "Appliance Repair",
                "area": "Mohammadpur, Dhaka",
                "years_experience": 7,
                "starting_price": Decimal("600.00"),
                "cancellation_rate": Decimal("1.40"),
                "response_time": "Usually replies in 20 min",
                "image_url": "/images/providers/sumon-mia.jpg",
                "identity_verified": True,
                "bio": "Refrigerator and washing machine diagnostics, component repairs, and appliance maintenance in Mohammadpur and Dhanmondi.",
                "tags": ["NID checked", "7 years experience", "Genuine spare parts", "Work history checked"],
                "services": [
                    ("Full Appliance Inspection", Decimal("600.00"), "Comprehensive electrical and mechanical diagnostic of home appliances."),
                    ("Refrigerator Cooling Service", Decimal("1100.00"), "Thermostat, fan motor, and compressor diagnostic and repair."),
                    ("Washing Machine Repair", Decimal("1400.00"), "Drum balancing, motor capacitor, and drain pump service."),
                ],
                "portfolio": [
                    ("Refrigerator compressor service", "Inverter compressor circuit board repair in Mohammadpur.", "/images/providers/sumon-mia.jpg"),
                    ("Washing machine service", "Drain motor replacement and drum balancing in Dhanmondi.", "/images/providers/sumon-mia.jpg"),
                ]
            },
        ]

        created_providers = []
        for pdata in providers_data:
            user, _ = User.objects.get_or_create(
                email=pdata["email"],
                defaults={
                    "first_name": pdata["first_name"],
                    "last_name": pdata["last_name"],
                    "phone": pdata["phone"],
                    "role": User.Role.PROVIDER,
                }
            )
            user.set_password("Provider123!")
            user.role = User.Role.PROVIDER
            user.save()

            profile, _ = ProviderProfile.objects.update_or_create(
                user=user,
                defaults={
                    "display_name": pdata["display_name"],
                    "category": pdata["category"],
                    "area": pdata["area"],
                    "years_experience": pdata["years_experience"],
                    "starting_price": pdata["starting_price"],
                    "cancellation_rate": pdata["cancellation_rate"],
                    "response_time": pdata["response_time"],
                    "image_url": pdata["image_url"],
                    "identity_verified": pdata["identity_verified"],
                    "bio": pdata["bio"],
                    "tags": pdata["tags"],
                    "is_active": True,
                }
            )

            # Services
            for s_name, s_price, s_desc in pdata["services"]:
                ProviderService.objects.update_or_create(
                    provider=profile,
                    name=s_name,
                    defaults={"price": s_price, "description": s_desc, "is_active": True}
                )

            # Portfolio
            for p_title, p_desc, p_img in pdata["portfolio"]:
                PortfolioItem.objects.get_or_create(
                    provider=profile,
                    title=p_title,
                    defaults={"description": p_desc, "image_url": p_img, "is_published": True}
                )

            created_providers.append(profile)
            self.stdout.write(f"  Provider ready: {profile.display_name} ({pdata['email']} / Provider123!)")

        # 4. Favorite provider
        if created_providers:
            FavoriteProvider.objects.get_or_create(
                customer=customer_user,
                provider=created_providers[0]
            )
            self.stdout.write(f"  Added favorite provider for {customer_user.email}")

        # 5. Bookings and Reviews
        rafiqul = created_providers[0]
        tanvir = created_providers[1]
        rafiqul_service = rafiqul.services.first()
        tanvir_service = tanvir.services.first()

        now = timezone.now()

        # Completed booking 1 with Review
        b1, _ = Booking.objects.get_or_create(
            customer=customer_user,
            provider=rafiqul,
            service=rafiqul_service,
            defaults={
                "service_name": rafiqul_service.name,
                "description": "Main circuit breaker tripped multiple times during evening load.",
                "address": "House 14, Road 5, Mirpur 10",
                "area": "Mirpur 10",
                "appointment_at": now - datetime.timedelta(days=5),
                "phone": "01711223344",
                "access_instructions": "3rd floor, apartment 3B. Ring the bell twice.",
                "price_estimate": rafiqul_service.price,
                "status": Booking.Status.COMPLETED,
            }
        )
        Review.objects.get_or_create(
            booking=b1,
            defaults={
                "customer": customer_user,
                "provider": rafiqul,
                "rating": 5,
                "body": "Rafiqul bhai arrived punctually, diagnosed the faulty MCB quickly, and fixed the wiring cleanly. Highly recommended!",
                "provider_reply": "Thank you for the kind words, Apa! Always glad to help keep your home safe.",
                "is_published": True,
            }
        )

        # Completed booking 2 with Review
        b2, _ = Booking.objects.get_or_create(
            customer=customer_two,
            provider=tanvir,
            service=tanvir_service,
            defaults={
                "service_name": tanvir_service.name,
                "description": "Inverter AC not cooling properly, blowing room temperature air.",
                "address": "Flat 4A, Road 27, Dhanmondi",
                "area": "Dhanmondi",
                "appointment_at": now - datetime.timedelta(days=3),
                "phone": "01799887766",
                "access_instructions": "Lift to 4th floor.",
                "price_estimate": tanvir_service.price,
                "status": Booking.Status.COMPLETED,
            }
        )
        Review.objects.get_or_create(
            booking=b2,
            defaults={
                "customer": customer_two,
                "provider": tanvir,
                "rating": 5,
                "body": "Tanvir tested refrigerant pressure with proper gauges and cleaned the cooling coils thoroughly. AC is freezing cold now.",
                "provider_reply": "Glad the cooling is back to 100%! Remember to clean the filter mesh monthly.",
                "is_published": True,
            }
        )

        # Active upcoming booking for customer
        b3, _ = Booking.objects.get_or_create(
            customer=customer_user,
            provider=tanvir,
            service=tanvir_service,
            defaults={
                "service_name": tanvir_service.name,
                "description": "Seasonal jet cleaning before summer starts.",
                "address": "Apartment 7C, Road 7/A, Dhanmondi",
                "area": "Dhanmondi",
                "appointment_at": now + datetime.timedelta(days=2),
                "phone": "01711223344",
                "access_instructions": "Security will escort from lobby.",
                "price_estimate": tanvir_service.price,
                "status": Booking.Status.CONFIRMED,
            }
        )

        # Open dispute for testing
        b4, _ = Booking.objects.get_or_create(
            customer=customer_user,
            provider=rafiqul,
            service=rafiqul_service,
            defaults={
                "service_name": "Switchboard Repair",
                "description": "Switch still sparking after initial check.",
                "address": "House 14, Road 5, Mirpur 10",
                "area": "Mirpur 10",
                "appointment_at": now - datetime.timedelta(days=1),
                "phone": "01711223344",
                "access_instructions": "3rd floor.",
                "price_estimate": Decimal("700.00"),
                "status": Booking.Status.DISPUTE_OPEN,
            }
        )
        Dispute.objects.get_or_create(
            booking=b4,
            defaults={
                "customer": customer_user,
                "provider": rafiqul,
                "description": "Customer reported sparking continues on switch 2 under high load. Requesting technician re-visit under warranty.",
                "booking_previous_status": Booking.Status.COMPLETED,
                "status": Dispute.Status.OPEN,
            }
        )

        # Availability block
        AvailabilityBlock.objects.get_or_create(
            provider=rafiqul,
            date=(now + datetime.timedelta(days=7)).date(),
            defaults={"reason": "Scheduled family event"}
        )

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
