using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System.IO;
using Microsoft.AspNetCore.Html;
using MySqlConnector;

namespace StinkyGamesDotNone.Pages
{
	public class IndexModel : PageModel
	{
		private readonly ILogger<IndexModel> _logger;

		public IndexModel(ILogger<IndexModel> logger)
		{
			_logger = logger;
		}

		/// <summary>
        /// Sends info links to its Razor Page
        /// </summary>
		//public FileInfo[] SendGameInfo()
  //      {
		//	FileInfo[] files = 
  //      }
		public void OnGet()
		{
			Console.WriteLine("Please don't pay attention on me");
		}
	}

}
