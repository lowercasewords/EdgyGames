using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation;
using MySqlConnector;

namespace StinkyGamesDotNone
{
    public class Startup
    {
        public IConfiguration _configuration;
        public IWebHostEnvironment _env;
        public MySqlConnection _mySqlConnection;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;

            //ConfigureDatabaseConn();
            //_mySqlConnection.Open();
            //Console.WriteLine(_mySqlConnection.State);
        }
        // for practicing purposes only, database connection should be established in individual
        // classes 
        private void ConfigureDatabaseConn()
        {
            string connString = _configuration.GetConnectionString("Default");
            _mySqlConnection = new MySqlConnection(connectionString: connString);
        }

        //This method gets called by the runtime. Use this method to add services to the container. </summary> //
        public void ConfigureServices(IServiceCollection services)
        { 
            services.AddRazorPages();
            services.AddTransient(_ => new MySqlConnection(_configuration["ConnectionStrings: Default"]));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
            });
        }
    }
}
