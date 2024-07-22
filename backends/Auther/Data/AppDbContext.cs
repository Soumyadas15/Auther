using Microsoft.EntityFrameworkCore;
using Auther.Models;

namespace Auther.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<VerificationToken> VerificationTokens { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<TwoFactorToken> TwoFactorTokens { get; set; }
        public DbSet<TwoFactorConfirmation> TwoFactorConfirmations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Account>()
                .HasIndex(a => new { a.Provider, a.ProviderAccountId })
                .IsUnique();

            modelBuilder.Entity<VerificationToken>()
                .HasIndex(v => new { v.Email, v.Token })
                .IsUnique();

            modelBuilder.Entity<PasswordResetToken>()
                .HasIndex(p => new { p.Email, p.Token })
                .IsUnique();

            modelBuilder.Entity<TwoFactorToken>()
                .HasIndex(t => new { t.Email, t.Token })
                .IsUnique();

            modelBuilder.Entity<TwoFactorConfirmation>()
                .HasIndex(t => t.UserId)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasMany(u => u.Accounts)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne(u => u.TwoFactorConfirmation)
                .WithOne(t => t.User)
                .HasForeignKey<TwoFactorConfirmation>(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Account>()
                .HasOne(a => a.User)
                .WithMany(u => u.Accounts)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TwoFactorConfirmation>()
                .HasOne(t => t.User)
                .WithOne(u => u.TwoFactorConfirmation)
                .HasForeignKey<TwoFactorConfirmation>(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}