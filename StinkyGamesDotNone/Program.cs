using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.IO;
using MySqlConnector;
namespace StinkyGamesDotNone
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //MySqlConnection mySqlConn = new MySqlConnection(Startup.Configuration.GetConnectionString("Default"));
            //try
            //{
            //    Console.WriteLine("Trying to Connect to database");
            //    await mySqlConn.OpenAsync();

            //    Console.WriteLine(mySqlConn.Database);
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine("Database might have thrown an exception!");
            //}
            CreateHostBuilder(args).Build().Run();
        }
        

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
