using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.IO;

namespace StinkyGamesDotNone
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();

            //List<string> images = new List<string>();
            //List<string> details = new List<string>();

            var stuff = new DirectoryInfo("Pages/Games").GetDirectories();
            //Console.WriteLine($"Amount of files: {stuff.Length}");
            //Array.ForEach(stuff, gameDir =>
            //{
            //    Array.ForEach(gameDir.GetDirectories("Information")[0].GetFiles(), files =>
            //    {
            //        Console.WriteLine(files);
            //    }
            //    );
            //}
            //);
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
